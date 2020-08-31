import { Length, IsPositive } from 'class-validator';
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
  @IsPositive()
  page: number;
}
