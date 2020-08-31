import { PaginationOptions } from '../graphql';
import { IsOptional } from 'class-validator';
import { IsPaginationOptionsObject } from '../shared/validation';

export class GetNewsFeedDTO {
  @IsOptional()
  @IsPaginationOptionsObject()
  pagination?: PaginationOptions;
}
