import {
  AuthType,
  Location,
  PointLocation,
  PaginationOptions,
} from '../graphql';
import { IsEmail, Length, IsOptional, Matches } from 'class-validator';
import { validationConfig } from '@footprint/config';
import {
  IsEmailAlreadyUsed,
  IsUsernameAlreadyUsed,
  IsLocationObject,
  IsPaginationOptionsObject,
} from '../shared/validation';

export class IsEmailAlreadyUsedDTO {
  @IsEmail()
  email: string;
}

export interface IsUsernameAlreadyUsedDTO {
  username: string;
}

export interface CreateNewUserDTO {
  username: string;
  email: string;
  authType: AuthType;
  location: Location;
  localPassword?: string;
  googleID?: string;
  profileImage?: string;
}

export class ChangePasswordWithTokenDTO {
  // TOKEN
  token: string;
  // PASSWORD NUOVA
  @Length(
    validationConfig.user.password.length.min,
    validationConfig.user.password.length.max,
  )
  newPassword: string;
}

export class EditProfileDTO {
  // USERNAME
  @IsOptional()
  @Length(
    validationConfig.user.username.length.min,
    validationConfig.user.username.length.max,
  )
  @Matches(validationConfig.user.username.regex)
  @IsUsernameAlreadyUsed()
  username?: string;

  // EMAIL
  @IsOptional()
  @IsEmail()
  @Length(0, validationConfig.user.email.length.max)
  @IsEmailAlreadyUsed()
  email?: string;

  // IMMAGINE PROFILO
  @IsOptional()
  profileImage?: string;

  // POSIZIONE
  @IsLocationObject()
  @IsOptional()
  location?: PointLocation;
}

export class EditPasswordDTO {
  // PASSWORD VECCHIA
  oldPassword: string;
  // PASSWORD NUOVA
  @Length(
    validationConfig.user.password.length.min,
    validationConfig.user.password.length.max,
  )
  newPassword: string;
}

export class SearchUserDTO {
  query: string;

  // PAGINAZIONI
  @IsOptional()
  @IsPaginationOptionsObject()
  pagination?: PaginationOptions;
}
