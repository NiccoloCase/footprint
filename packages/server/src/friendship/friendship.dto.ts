import { PaginationOptions } from '../graphql';

export class GetFollowersDTO {
  userId: string;
  pagination?: PaginationOptions;
}

export class GetFollowingDTO {
  userId: string;
  pagination?: PaginationOptions;
}
