import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { SignupDTO, LoginDTO } from './auth.dto';
import { AuthPayload, AuthType, ProcessResult, User } from '../graphql';
import { UsersService } from 'src/users/users.service';
import { CreateNewUserDTO } from '../users/users.dto';
import { AuthService } from './auth.service';
import { Private } from './auth.guard';
import { CurrentUser } from '../users/user.decorator';
import { IUser } from 'src/users/users.schema';
import { BadRequestException } from '@nestjs/common';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // RESTITUISCE L'UTENTE LOGGATO
  @Query()
  @Private()
  whoami(@CurrentUser() user: IUser | null): IUser {
    // TODO -> filter
    return user;
  }

  // REGISTRA UN NUOVO UTENTE
  @Mutation()
  async signup(@Args() args: SignupDTO): Promise<ProcessResult> {
    const payload: CreateNewUserDTO = {
      username: args.username,
      email: args.email,
      localPassword: args.password,
      authType: AuthType.LOCAL,
    };

    try {
      await this.usersService.createNewUser(payload);
      return { success: true };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  // ESEGUE IL LOGIN LOCALE DELL'UTENTE
  @Mutation()
  login(@Args() args: LoginDTO): Promise<AuthPayload> {
    return this.authService.loginUserLocally(args);
  }
}
