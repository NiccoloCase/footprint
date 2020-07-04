import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { isEmpty } from 'lodash';
import { UsersService } from './users.service';
import { IsEmailAlreadyUsedDTO, IsUsernameAlreadyUsedDTO } from './users.dto';
import { BadRequestException } from '@nestjs/common';
import { EmailResponse } from '../graphql';

@Resolver('Users')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

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

  // INVIA PER EMAIL IL TOKEN PER VERIFICARE L'EMAIL
  @Mutation()
  async sendConfirmationEmail(
    @Args('email') email: string,
  ): Promise<EmailResponse> {
    // cerca l'utente tramite l'email
    const user = await this.usersService.getUserByEmail(email);

    // controlla che l'uetnte esista e non sia già verificato
    if (!user) throw new BadRequestException('User does not exist');
    else if (user.isVerified)
      throw new BadRequestException('User is already verified');
    // invia l'email di conferma
    await this.usersService.sendConfirmationEmail(user);
    return { success: true, recipient: user.email };
  }
}
