import { PointLocation } from '../graphql';

export class SignupDTO {
  email: string;
  password: string;
  username: string;
  location: PointLocation;
  profileImage?: string;
}

export class SignupWithGoogleDTO {
  username: string;
  location: PointLocation;
  profileImage?: string;
}

export class LoginDTO {
  email: string;
  password: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}
