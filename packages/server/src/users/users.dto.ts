import { AuthType } from '../graphql';

export interface CreateNewUserDTO {
  username: string;
  email: string;
  authType: AuthType;
  localPassword?: string;
  googleID?: string;
  profileImage?: string;
}
