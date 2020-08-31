import { PointLocation, Location } from '../graphql';
import { IsEmail, Matches, Length } from 'class-validator';
import {
  IsEmailAlreadyUsed,
  IsUsernameAlreadyUsed,
  IsLocationObject,
} from '../shared/validation';
import { validationConfig } from '@footprint/config';

export class SignupDTO {
  // EMAIL
  @IsEmail()
  @Length(0, validationConfig.user.email.length.max)
  @IsEmailAlreadyUsed()
  email: string;

  // PASSWORD
  @Length(
    validationConfig.user.password.length.min,
    validationConfig.user.password.length.max,
  )
  password: string;

  // USERNAME
  @Length(
    validationConfig.user.username.length.min,
    validationConfig.user.username.length.max,
  )
  @Matches(validationConfig.user.username.regex)
  @IsUsernameAlreadyUsed()
  username: string;
  // POSIZIONE
  @IsLocationObject()
  location: Location;

  // IMMAGINE PROFILO
  profileImage?: string;
}

export class SignupWithGoogleDTO {
  // USERNAME
  @Length(
    validationConfig.user.username.length.min,
    validationConfig.user.username.length.max,
  )
  @Matches(validationConfig.user.username.regex)
  @IsUsernameAlreadyUsed()
  username: string;

  // POSIZIONE
  @IsLocationObject()
  location: Location;

  // IMMAGINE PROFILO
  profileImage?: string;
}

export class LoginDTO {
  @IsEmail()
  email: string;
  password: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}
