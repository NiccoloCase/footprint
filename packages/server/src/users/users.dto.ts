import {
  AuthType,
  Location,
  PointLocation,
  PaginationOptions,
} from '../graphql';

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
  location: Location;
  localPassword?: string;
  googleID?: string;
  profileImage?: string;
}

export class ChangePasswordWithTokenDTO {
  token: string;
  newPassword: string;
}

export class EditProfileDTO {
  username?: string;
  email?: string;
  profileImage?: string;
  location?: PointLocation;
}

export class EditPasswordDTO {
  oldPassword: string;
  newPassword: string;
}

export class SearchUserDTO {
  query: string;
  pagination?: PaginationOptions;
}
