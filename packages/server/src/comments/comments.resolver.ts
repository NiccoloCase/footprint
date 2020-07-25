import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Query,
} from '@nestjs/graphql';
import {
  PostCommentDTO,
  DeleteCommentDTO,
  GetCommentsDTO,
} from './comments.dto';
import { CommentsService } from './comments.service';
import { CurrentUser } from '../users/user.decorator';
import { Private } from '../auth/auth.guard';
import { IUser } from '../users/users.schema';
import { Comment, ProcessResult } from '../graphql';
import { UsersService } from '../users/users.service';

@Resolver('Comment')
export class CommentsResolver {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly usersService: UsersService,
  ) {}

  // RESTITUISCE L'AUTORE DI UN COMMENTO
  @ResolveField()
  author(@Parent() comment: Comment) {
    const { authorId } = comment;
    return this.usersService.getUserById(authorId);
  }

  // RESTITUISCE I COMMENTI ASSOCIATI AL CONTENUTO PASSATO
  @Query()
  getComments(@Args() payload: GetCommentsDTO) {
    const { contentId, page } = payload;
    return this.commentsService.findComments(contentId, page);
  }

  // POSTA UN NUOVO COMMENTO
  @Mutation()
  @Private()
  postComment(@Args() payload: PostCommentDTO, @CurrentUser() author: IUser) {
    const { text, contentId } = payload;
    return this.commentsService.createComment(author.id, contentId, text);
  }

  // ELIMINA UN COMMENTO
  @Mutation()
  @Private()
  async delateComment(
    @Args() payload: DeleteCommentDTO,
    @CurrentUser() user: IUser,
  ): Promise<ProcessResult> {
    const { id, contentId } = payload;
    await this.commentsService.deleteComment(id, contentId, user.id);
    return { success: true };
  }
}
