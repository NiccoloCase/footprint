import { Length, Min, IsOptional, IsInt } from 'class-validator';
import { validationConfig } from '@footprint/config';

export class PostCommentDTO {
  contentId: string;
  @Length(0, validationConfig.comment.text.length.max)
  text: string;
}

export interface DeleteCommentDTO {
  contentId: string;
  id: string;
}

export class GetCommentsDTO {
  contentId: string;
  @IsInt()
  @Min(0)
  @IsOptional()
  page: number;
}
