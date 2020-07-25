export class PostCommentDTO {
  contentId: string;
  text: string;
}

export class DeleteCommentDTO {
  contentId: string;
  id: string;
}

export class GetCommentsDTO {
  contentId: string;
  page: number;
}
