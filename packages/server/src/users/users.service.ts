import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateNewUserDTO } from './users.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser, IUserModel } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUserModel>,
  ) {}

  /**
   * Restituisce l'utente associato all'email passato
   * @param id
   */
  async getUserByEmail(email: string): Promise<IUser> {
    try {
      const user = await this.userModel.findOne({ email });
      return user;
    } catch (err) {
      throw new BadRequestException(err);
    }
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
   * Salva un nuovo utente nel database
   * @param userPayload
   */
  async createNewUser(userPayload: CreateNewUserDTO): Promise<IUser> {
    try {
      return await this.userModel.create(userPayload);
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
}
