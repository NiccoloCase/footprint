import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateNewUserDTO } from './users.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser, IUserModel } from './users.schema';
import { AuthType, TokenScope } from '../graphql';
import { TokenService } from '../token/token.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUserModel>,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Restituisce il modello della collezione degli utenti
   */
  getUserModel(): Model<IUserModel> {
    return this.userModel;
  }

  /**
   * Restituisce l'utente associato all'ID passato
   * @param id
   */
  async getUserById(id: string): Promise<IUser> {
    try {
      const user = await this.userModel.findById(id);
      return user;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * Restituisce l'utente associato all'email passato
   * @param email
   */
  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await this.userModel.findOne({ email });
      return user;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * Restituisce l'utente associato all'username passato
   * @param username
   */
  async getUserByUsername(username: string): Promise<IUser> {
    try {
      const user = await this.userModel.findOne({ username });
      return user;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * Restituisce l'utente associato all'ID di Google
   * @param id
   */
  async getUserByGoogleID(googleID: string): Promise<IUser | null> {
    return await this.userModel.findOne({ googleID });
  }

  /**
   * Salva un nuovo utente nel database
   * @param userPayload
   */
  async createNewUser(userPayload: CreateNewUserDTO): Promise<IUser> {
    const data: any = { ...userPayload };
    if (userPayload.authType === AuthType.LOCAL) data.isVerified = false;

    try {
      return await this.userModel.create(data);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * Invalida tutti i token di aggiornamento di un deterimato utente
   */
  async revokeRefreshTokensForUser(userId: string): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $inc: { refreshTokenVersion: 1 } },
    );
  }

  /**
   * Invia l'email contente il token per la verifica dell'account
   * @param user
   */
  async sendConfirmationEmail(user: IUser): Promise<void> {
    try {
      // genera un nuovo token (o utilizza uno ancora valido)
      const token = await this.tokenService.generateNewToken(
        user.id,
        TokenScope.USER_CONFIRMATION,
      );

      await this.emailService.sendConfirmationEmail(
        user.email,
        token._id,
        user.username,
      );
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * Verifica un l'email di utente
   * @param token Token
   * @param userId Id dell'utente da confermare
   * @returns Restituisce il documento dell'utente associato al token passato
   */
  async verfyEmail(token: string): Promise<IUser> {
    // controlla la validità del token
    const tokenDocument = await this.tokenService.verifyAndDestroyToken(
      token,
      TokenScope.USER_CONFIRMATION,
    );

    // Verifica l'utente
    try {
      const user = await this.userModel.findByIdAndUpdate(
        tokenDocument.userId,
        { isVerified: true },
        { new: true },
      );
      return user;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  /**
   * Invia l'email contente il token per cambiare password
   * @param user
   */
  async sendForgotPasswordEmail(user: IUser): Promise<void> {
    try {
      // Genera un nuovo token (o utilizza uno ancora valido)
      const token = await this.tokenService.generateNewToken(
        user.id,
        TokenScope.FORGOT_PASSWORD,
      );

      await this.emailService.sendForgotPasswordEmail(
        user.email,
        token._id,
        user.username,
      );
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * Cambia la password dell'utente con l'ID passato
   * @param userId Id dell'utente
   * @param newPassword Nuova password
   */
  async changePassword(userId: string, newPassword: string): Promise<void> {
    try {
      const user = await this.userModel.findById(userId);
      user.localPassword = newPassword;
      await user.save();
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
