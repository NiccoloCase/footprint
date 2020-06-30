export class SignupDTO {
  username: string;
  email: string;
  password: string;
}

export class LoginDTO {
  email: string;
  password: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}
