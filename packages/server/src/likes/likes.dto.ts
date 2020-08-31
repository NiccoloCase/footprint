import { IsPositive } from 'class-validator';

export class GetLikesDTO {
  footprintId: string;
  @IsPositive()
  page?: number;
}
