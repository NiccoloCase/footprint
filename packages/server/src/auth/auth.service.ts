import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './auth.dto';
import { IUser } from 'src/users/users.schema';
import { AuthPayload, AuthType } from 'src/graphql';
import { AccessTokenPayload, RefreshTokenPayload } from './auth.types';
import config from '@footprint/config';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Esegue la'accesso di un utente secondo i dati passati
   * @param payload
   */
  async loginUserLocally(payload: LoginDTO): Promise<AuthPayload> {
    const { email, password } = payload;

    // Controlla che l'email passata appartenga a un utente registrto
    const user = await this.usersService.getUserByEmail(email);

    if (!user || user.authType !== AuthType.LOCAL)
      throw new UnauthorizedException('User does not exist');

    // Controlla che la password passata corrisponda a quella dell'utente
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) throw new UnauthorizedException('Wrong password');

    // Controlla che l'utente abbia verificato l'email
    // TODO

    // Genera il token di accesso
    const { accessToken, expiresIn } = this.generateAccessToken(user);

    // Genera il token di aggiornamento
    const refreshToken = this.generateRefreshToken(user);

    return { accessToken, refreshToken, expiresIn };
  }

  /**
   * Genera un Json Web Token di accesso
   * @param user
   */
  generateAccessToken(user: IUser) {
    // payload
    const { id } = user;
    const payload: AccessTokenPayload = { userId: id };

    // scadenza del token
    const expiresIn = config.auth.ACCESS_TOKEN_EXPIRATION;

    // firma il token
    const accessToken = jwt.sign(payload, config.auth.ACCESS_TOKEN_SECRET, {
      expiresIn,
      // TODO:
      //issuer: "",
      //audience:"",
      //subject: ""
    });

    return { accessToken, expiresIn };
  }

  /**
   * Genera un refresh token
   * @param user
   */
  generateRefreshToken(user: IUser): string {
    // payload
    const { id } = user;
    const payload: RefreshTokenPayload = {
      userId: id,
      tokenVersion: user.refreshTokenVersion,
    };

    // firma il token
    const refrehToken = jwt.sign(payload, config.auth.REFRESH_TOKEN_SECRET, {
      expiresIn: config.auth.REFRESH_TOKEN_EXPIRATION,
      // TODO:
      //issuer: "",
      //audience:"",
      //subject: ""
    });

    return refrehToken;
  }
}
