import { Min, IsOptional } from 'class-validator';

export class GetLikesDTO {
  footprintId: string;
  @IsOptional()
  @Min(0)
  page?: number;
}
