import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { isEmpty } from 'lodash';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import {
  IsEmailAlreadyUsedDTO,
  IsUsernameAlreadyUsedDTO,
  ChangePasswordWithTokenDTO,
  EditProfileDTO,
  EditPasswordDTO,
  SearchUserDTO,
} from './users.dto';
import {
  BadRequestException,
  Inject,
  forwardRef,
  UnauthorizedException,
} from '@nestjs/common';
import {
  EmailResponse,
  ProcessResult,
  TokenScope,
  AuthType,
  User,
  PaginationOptions,
  LocationType,
} from '../graphql';
import { TokenService } from '../token/token.service';
import { FriendshipService } from '../friendship/friendship.service';
import { Private } from '../auth/auth.guard';
import { CurrentUser } from './user.decorator';
import { IUser } from './users.schema';
import { EditProfileResult } from '../graphql';

@Resolver('User')
export class UsersResolver {
  constructor(
    @Inject(forwardRef(() => FriendshipService))
    private readonly friendshipService: FriendshipService,
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  // RESTITUISCE SE L'UTENTE É SEGUTO DALL'UTENTE PASSATO
  @ResolveField()
  async isFollowed(
    @Parent() target: User,
    @Args('id') user: string,
  ): Promise<boolean | null> {
    if (!user) return null;
    else if (target.id === user) return null;

    try {
      return await this.friendshipService.checkIfIsFollower(user, target.id);
    } catch (err) {
      return null;
    }
  }

  // RESTITUISCE I FOLLOWERS DELL'UTENTE
  @ResolveField()
  async followers(
    @Parent() target: User,
    @Args('pagination') pagination: PaginationOptions,
  ) {
    const { id } = target;
    try {
      const followers = await this.friendshipService.getFollowers(
        id,
        pagination,
      );
      return followers;
    } catch (err) {
      return [];
    }
  }

  // RESTITUISCE GLI UTENTI SEGUITI
  @ResolveField()
  async following(
    @Parent() target: User,
    @Args('pagination') pagination: PaginationOptions,
  ) {
    const { id } = target;
    try {
      const following = await this.friendshipService.getFollowing(
        id,
        pagination,
      );

      return following;
    } catch (err) {
      return [];
    }
  }

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

  // RESTITUISCE UN UTENTE TRAMITE L'ID
  @Query()
  async getUserById(@Args('id') id: string) {
    // TODO -> rimuovere i dati sensibili
    const user = await this.usersService.getUserById(id);

    return user;
  }

  // CERCA UN UTENTE TRAMITE IL NOME
  @Query()
  searchUser(@Args() payload: SearchUserDTO) {
    const { query, pagination } = payload;
    return this.usersService.searchUserByUsername(query, pagination);
  }

  // MODIFICA IL PROFILO
  @Mutation()
  @Private()
  async editProfile(
    @Args() changes: EditProfileDTO,
    @CurrentUser() user: IUser,
  ): Promise<EditProfileResult> {
    // Se è stata cambiata l'email
    const isEmailConfirmationRequired =
      !!changes.email && changes.email !== user.email;

    // Se l'email è stata cambiata richiede all'utente la conferma
    if (isEmailConfirmationRequired) changes['isVerified'] = false;

    // Normalizza la posizione
    if (typeof changes.location === 'object')
      changes.location['type'] = LocationType.Point;

    try {
      const newUser = await this.usersService.editUserProfile(changes, user.id);

      // Se l'email è stata cambiata invia all'utente un email per
      // eseguire la conferma
      if (isEmailConfirmationRequired)
        await this.usersService.sendConfirmationEmail(newUser);

      return {
        success: true,
        isEmailConfirmationRequired,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
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

  // MODIFICA LA PASSWORD DELL'UTETE
  @Mutation()
  @Private()
  async editPassword(
    @Args() { oldPassword, newPassword }: EditPasswordDTO,
    @CurrentUser() user: IUser,
  ): Promise<ProcessResult> {
    try {
      // Controlla che la password passata sia corretta
      const match = await bcrypt.compare(oldPassword, user.localPassword);
      if (!match) throw new UnauthorizedException('Password is wrong');

      // Modifica la password
      await this.usersService.changePassword(user.id, newPassword);

      return { success: true };
    } catch (err) {
      return { success: false };
    }
  }
}
