import { Module, forwardRef } from '@nestjs/common';
import { NewsFeedService } from './news-feed.service';
import { NewsFeedResolver } from './news-feed.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsFeedSchema } from './news-feed.schema';
import { FriendshipModule } from '../friendship/friendship.module';
import { FootprintsModule } from '../footprints/footprints.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'NewsFeed', collection: 'newsFeed', schema: NewsFeedSchema },
    ]),
    forwardRef(() => FriendshipModule),
    forwardRef(() => FootprintsModule),
  ],
  providers: [NewsFeedService, NewsFeedResolver],
  exports: [NewsFeedService],
})
export class NewsFeedModule {}
