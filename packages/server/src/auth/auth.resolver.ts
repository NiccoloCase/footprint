import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { SignupDTO, LoginDTO, SignupWithGoogleDTO } from './auth.dto';
import {
  AuthPayload,
  AuthType,
  ProcessResult,
  User,
  GoogleAuthResult,
} from '../graphql';
import { UsersService } from '../users/users.service';
import { CreateNewUserDTO } from '../users/users.dto';
import { AuthService } from './auth.service';
import { Private, GoogleStrategyGuard } from './auth.guard';
import { CurrentUser } from '../users/user.decorator';
import { IUser } from '../users/users.schema';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { GoogleStrategyResult } from './auth.types';

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

  // REGISTRA UN NUOVO UTENTE IN LOCALE
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

  // REGISTRA UN NUOVO UTENTE CON GOOGLE
  @Mutation()
  @UseGuards(GoogleStrategyGuard)
  async signupWithGoogle(
    @Args() args: SignupWithGoogleDTO,
    @CurrentUser() payload: GoogleStrategyResult,
  ): Promise<GoogleAuthResult> {
    const { username } = args;
    const { googleProfile, user } = payload;

    // l'utente è già registrato:
    // genera i token di accesso e di aggiornamento per il nuovo utente
    if (user) return this.authService.loginWithGoogle(user);

    const userData: CreateNewUserDTO = {
      username,
      email: googleProfile.email,
      authType: AuthType.GOOGLE,
      googleID: googleProfile.id,
    };

    try {
      // crea un nuivo utente
      const user = await this.usersService.createNewUser(userData);
      // genera i token di accesso e di aggiornamento per il nuovo utente
      return this.authService.loginWithGoogle(user);
    } catch (err) {
      console.log({ err });
      throw new BadRequestException(err);
    }
  }

  // ESEGUE IL LOGIN LOCALE DELL'UTENTE
  @Mutation()
  login(@Args() args: LoginDTO): Promise<AuthPayload> {
    return this.authService.loginUserLocally(args);
  }

  // ESEGUE L'ACCESSO CON GOOGLE
  @Mutation()
  @UseGuards(GoogleStrategyGuard)
  async loginWithGoogle(
    @CurrentUser() payload: GoogleStrategyResult,
  ): Promise<GoogleAuthResult> {
    const { isRegistrationRequired, user, googleProfile } = payload;

    if (isRegistrationRequired)
      return {
        isRegistrationRequired,
        googleProfile,
      };

    return this.authService.loginWithGoogle(user);
  }
}
