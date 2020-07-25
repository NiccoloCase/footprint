import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { ProcessResult } from '../graphql';
import { LikesService } from './likes.service';
import { CurrentUser } from '../users/user.decorator';
import { Private } from '../auth/auth.guard';
import { IUser } from '../users/users.schema';
import { GetLikesDTO } from './likes.dto';

@Resolver('Like')
export class LikesResolver {
  constructor(private readonly likesService: LikesService) {}

  // RESTITUISCE I LIKES DEL FOOTPRINT PASSATO
  @Query()
  getLikes(@Args() payload: GetLikesDTO) {
    const { footprintId, page } = payload;
    return this.likesService.findLikes(footprintId, page);
  }

  // AGGIUNGE UN LIKE AL FOOTPRINT ASSOCIATO ALL'ID PASSATO
  @Mutation()
  @Private()
  async addLikeToFootprint(
    @Args('footprintId') footprintId: string,
    @CurrentUser() user: IUser,
  ): Promise<ProcessResult> {
    try {
      await this.likesService.addLike(footprintId, user.id);
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  }

  // RIMUOVE IL LIKE AL FOOTPRINT ASSOCIATO ALL'ID PASSATO
  @Mutation()
  @Private()
  async removeFootprintLike(
    @Args('footprintId') footprintId: string,
    @CurrentUser() user: IUser,
  ): Promise<ProcessResult> {
    try {
      await this.likesService.removeLike(footprintId, user.id);
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  }
}
