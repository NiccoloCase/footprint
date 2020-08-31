import { PaginationOptions } from '../graphql';
import { IsPaginationOptionsObject } from '../shared/validation';
import { IsOptional } from 'class-validator';

export class GetFollowersDTO {
  userId: string;
  @IsOptional()
  @IsPaginationOptionsObject({ ne: true } as any)
  pagination?: PaginationOptions;
}

export class GetFollowingDTO {
  userId: string;
  @IsOptional()
  @IsPaginationOptionsObject()
  pagination?: PaginationOptions;
}
