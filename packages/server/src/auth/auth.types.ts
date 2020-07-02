import { IUser } from '../users/users.schema';
import { GoogleProfile } from '../graphql';

export interface AccessTokenPayload {
  userId: string;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
}

export interface GoogleStrategyResult {
  isRegistrationRequired: boolean;
  user?: IUser;
  googleProfile?: GoogleProfile;
}
