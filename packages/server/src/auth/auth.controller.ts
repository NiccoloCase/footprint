import { Controller, Post, Req, Res, Body } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { RefreshTokenPayload } from './auth.types';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import config from '@footprint/config';
import { RefreshTokenDTO } from './auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authservice: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // RESTITUISCE UN NUOVO TOKEN DI ACCESSO
  @Post('refresh_token')
  async refreshToken(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: RefreshTokenDTO,
  ) {
    // recupera il refresh token dai cookies o dal body
    const token: string | null =
      req.cookies['refresh_token'] || body['refresh_token'];
    if (!token) return res.status(400).send({ success: false });

    try {
      // verifica il refresh token
      const { userId, tokenVersion } = verify(
        token,
        config.auth.REFRESH_TOKEN_SECRET,
      ) as RefreshTokenPayload;

      // cerca l'utente associato al token
      const user = await this.usersService.getUserById(userId);

      if (user.refreshTokenVersion !== tokenVersion)
        return res.status(401).send({ success: false });

      // genera un nuovo access token
      const { accessToken } = this.authservice.generateAccessToken(user);

      // genera un nuovo refresh token
      const refreshToken = this.authservice.generateRefreshToken(user);

      res.send({
        success: true,
        tokens: {
          accessToken,
          refreshToken,
        },
      });
    } catch (err) {
      return res.status(401).send({ success: false });
    }
  }
}
