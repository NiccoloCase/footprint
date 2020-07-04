import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy as passportJwtStrategy,
  ExtractJwt,
  VerifiedCallback,
} from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { AccessTokenPayload, GoogleStrategyResult } from './auth.types';
import config from '@footprint/config';
import { AuthType } from '../graphql';
const GoogleTokenStrategy = require('passport-google-token').Strategy;

/**
 * STRATEGIA PER I JSON WEB TOKEN
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(passportJwtStrategy, 'jwt') {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.auth.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: AccessTokenPayload, done: VerifiedCallback) {
    try {
      // cerca l'utente tramite l'id salvato nel payload
      const user = await this.userService.getUserById(payload.userId);
      //Se non è stato trovato nessun utente lancia un errore
      if (!user)
        return done(new UnauthorizedException('Unauthorized access'), false);

      // Passa a passport il documento dell'utente
      done(null, user);
    } catch (err) {
      return done(new UnauthorizedException('Unauthorized access'), false);
    }
  }
}

/**
 * STRATEGIA PER L'OAUTH2 DI GOOGLE
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(
  GoogleTokenStrategy,
  'google',
) {
  constructor(private readonly userService: UsersService) {
    super({
      clientID: config.googleOAuth.WEB_CLIENT_ID,
      clientSecret: config.googleOAuth.WEB_CLIENT_SECRET,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifiedCallback,
  ) {
    try {
      const googleID: string = profile.id;
      let result: GoogleStrategyResult;

      // Controlla se l'utente è già registrato nel database con l'id google
      const user = await this.userService.getUserByGoogleID(googleID);

      if (user) {
        result = {
          isRegistrationRequired: false,
          user,
        };
      } else {
        const name: string = profile.displayName;
        const email: string = profile.emails[0].value;
        const profileImage: string = profile._json.picture;

        result = {
          isRegistrationRequired: true,
          googleProfile: {
            name,
            email,
            picture: profileImage,
            id: googleID,
          },
        };
      }

      done(null, result);
    } catch (err) {
      done(err, false);
    }
  }
}
