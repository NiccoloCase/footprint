import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITokenModel } from './token.schema';
import { TokenScope, Token } from '../graphql';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel('Token') private readonly tokenModel: Model<ITokenModel>,
  ) {}

  /**
   * Genera un token numerico di sei cifre unico
   * @param callback
   */
  generateUniqueCode(callback: (error?: string, code?: number) => void): void {
    // genera un coddice casuale di 6 cifre
    const code = Math.floor(100000 + Math.random() * 900000);
    // controlla che non sia già in uso
    this.tokenModel.findOne({ _id: code }, (err: any, result: ITokenModel) => {
      if (err) callback(err);
      else if (result) return this.generateUniqueCode(callback);
      else callback(null, code);
    });
  }

  /**
   * Genera e salva nel database un nuovo token
   * (Se ne esiste già uno valido restituisce quello)
   * @param userId Id dell'utente che ha richiesto il token
   * @param scope Ambito del token
   */
  generateNewToken(userId: string, scope: TokenScope): Promise<ITokenModel> {
    return new Promise((resolve, reject) => {
      // Controlla se esiste già un token ancora valido
      this.tokenModel
        .findOne({ userId, scope })
        .then(token => {
          // Restituisce il token precedentemente generato ma ancora valido
          if (token) return resolve(token);

          // Crea un nuovo token
          this.generateUniqueCode((err, code) => {
            if (err) return reject(new InternalServerErrorException());

            this.tokenModel
              .create({ userId, scope, _id: code })
              .then(doc => resolve(doc))
              .catch(() => reject(new InternalServerErrorException()));
          });
        })
        .catch(() => reject(new InternalServerErrorException()));
    });
  }

  /**
   * Controlla l'esistenza nel database di un token con l'ID passato e
   * che questo abbia un preciso ambito. Se il token esiste viene elimianto dal database.
   * @param token
   * @param scope
   * @returns Restituisce il documento del token se le verifiche hanno avuto successo
   */
  async verifyAndDestroyToken(
    token: string | number,
    scope: TokenScope,
  ): Promise<Token> {
    let tokenDoc: Token;
    try {
      const _id = typeof token === 'string' ? Number(token) : token;
      tokenDoc = await this.tokenModel.findOneAndDelete({ _id });
    } catch (err) {
      throw new InternalServerErrorException();
    }
    if (!tokenDoc)
      throw new BadRequestException(
        'The token passed does not exist: it may have expired or already been used',
      );
    if (tokenDoc.scope !== scope)
      throw new BadRequestException(
        'The token passed is not of the requested type',
      );

    return tokenDoc;
  }
}
