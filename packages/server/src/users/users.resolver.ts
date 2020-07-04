import { Resolver, Query, Args } from '@nestjs/graphql';
import { isEmpty } from 'lodash';
import { UsersService } from './users.service';
import { IsEmailAlreadyUsedDTO, IsUsernameAlreadyUsedDTO } from './users.dto';

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
}
