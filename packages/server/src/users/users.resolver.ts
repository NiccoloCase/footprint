import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { isEmpty } from 'lodash';
import { UsersService } from './users.service';
import {
  IsEmailAlreadyUsedDTO,
  IsUsernameAlreadyUsedDTO,
  ChangePasswordWithTokenDTO,
} from './users.dto';
import { BadRequestException } from '@nestjs/common';
import { EmailResponse, ProcessResult, TokenScope, AuthType } from '../graphql';
import { TokenService } from '../token/token.service';

@Resolver('Users')
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  // RESTITUISCE SE L'EMAIL PASSATA E' GIA' UTILIZZATA
  @Query()
  async isEmailAlreadyUsed(@Args() { email }: IsEmailAlreadyUsedDTO) {
    const user = await this.usersService.getUserByEmail(email);
    return !isEmpty(user);
  }

  // RESTITUISCE SE L'USERNAME PASSATO E' GIA' UTILIZZATO
  @Query()
  async isUsernameAlreadyUsed(@Args() { username }: IsUsernameAlreadyUsedDTO) {
    const user = await this.usersService.getUserByUsername(username);
    return !isEmpty(user);
  }

  // RESTITUISCE UN UTENTE TRAMITE L'USERNAME
  @Query()
  getUserById(@Args('id') id: string) {
    // TODO -> rimuovere i dati sensibili
    return this.usersService.getUserById(id);
  }

  // INVIA PER EMAIL IL TOKEN PER LA VERIFICA DELL'EMAIL
  @Mutation()
  async sendConfirmationEmail(
    @Args('email') email: string,
  ): Promise<EmailResponse> {
    // cerca l'utente tramite l'email
    const user = await this.usersService.getUserByEmail(email);

    // controlla che l'utente esista e non sia già verificato
    if (!user) throw new BadRequestException('User does not exist');
    else if (user.isVerified)
      throw new BadRequestException('User is already verified');
    // invia l'email di conferma
    await this.usersService.sendConfirmationEmail(user);
    return { success: true, recipient: user.email };
  }

  // INVIA PER EMAIL IL TOKEN PER CAMBIARE PASSWORD
  @Mutation()
  async forgotPassword(@Args('email') email: string): Promise<EmailResponse> {
    // cerca l'utente tramite l'email e controlla che esista
    const user = await this.usersService.getUserByEmail(email);
    if (!user || user.authType !== AuthType.LOCAL)
      throw new BadRequestException('User does not exist');

    // Invia l'email
    this.usersService.sendForgotPasswordEmail(user);
    return { success: true, recipient: user.email };
  }

  // CAMBIA L'EMAIL DELL'UTENTE TRAMITE IL TOKEN PASSATO
  @Mutation()
  async changePasswordWithToken(
    @Args() { token, newPassword }: ChangePasswordWithTokenDTO,
  ): Promise<ProcessResult> {
    try {
      // Recupera e verifica la validità del token
      const { userId } = await this.tokenService.verifyAndDestroyToken(
        token,
        TokenScope.FORGOT_PASSWORD,
      );

      await this.usersService.changePassword(userId, newPassword);

      return { success: true };
    } catch (err) {
      return { success: false };
    }
  }
}
