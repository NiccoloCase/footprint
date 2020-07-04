import { AuthType } from '../graphql';

export class IsEmailAlreadyUsedDTO {
  email: string;
}

export class IsUsernameAlreadyUsedDTO {
  username: string;
}

export interface CreateNewUserDTO {
  username: string;
  email: string;
  authType: AuthType;
  localPassword?: string;
  googleID?: string;
  profileImage?: string;
}
