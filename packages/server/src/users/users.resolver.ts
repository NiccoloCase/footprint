import { Resolver, Query, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';

@Resolver('Users')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query()
  getUserById(@Args('id') id: string) {
    // TODO -> rimuovere i dati sensibili
    return this.usersService.getUserById(id);
  }
}
