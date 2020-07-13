import { Module, forwardRef } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipResolver } from './friendship.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendshipSchema } from './friendship.schema';
import { UsersModule } from '../users/users.module';
import { NewsFeedModule } from '../news-feed/news-feed.module';
import { FootprintsModule } from '../footprints/footprints.module';
import { NewsFeedService } from '../news-feed/news-feed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Friendship', schema: FriendshipSchema },
    ]),
    forwardRef(() => NewsFeedModule),
    forwardRef(() => FootprintsModule),
    UsersModule,
  ],
  providers: [FriendshipService, FriendshipResolver],
  exports: [FriendshipService],
})
export class FriendshipModule {}
