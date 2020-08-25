import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { NewsFeedService } from './news-feed.service';
import { Private } from '../auth/auth.guard';
import { CurrentUser } from '../users/user.decorator';
import { IUser } from '../users/users.schema';
import { ProcessResult } from '../graphql';
import { GetNewsFeedDTO } from './news-feed.dto';

@Resolver('NewsFeed')
export class NewsFeedResolver {
  constructor(private readonly newsFeedService: NewsFeedService) {}

  // RESTITUISCE IL FEED DELL'UTENTE LOGGATO
  @Query()
  @Private()
  async getNewsFeed(
    @Args() payload: GetNewsFeedDTO,
    @CurrentUser() user: IUser,
  ) {
    const { pagination } = payload;
    const feed = await this.newsFeedService.getNewsFeed(user.id, pagination);
    return feed;
  }

  // SEGNA L'ELEMENTO DEL FEED DELL'UTENTE LOGGATO COME VISTO
  @Mutation()
  @Private()
  async markFeedItemAsSeen(
    @Args('id') id: string,
    @CurrentUser() user: IUser,
  ): Promise<ProcessResult> {
    await this.newsFeedService.markFeedItemAsSeen(id, user.id);
    return { success: true };
  }
}
