import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy as passportJwtStrategy,
  ExtractJwt,
  VerifiedCallback,
} from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { AccessTokenPayload } from './auth.types';
import config from '@footprint/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(passportJwtStrategy) {
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
      // se non è stato trovato nessun utente lancia un errore
      if (!user)
        return done(new UnauthorizedException('Unauthorized access'), false);
      // se invece è stato trovato lo passa a passport
      done(null, user);
    } catch (err) {
      return done(new UnauthorizedException('Unauthorized access'), false);
    }
  }
}
