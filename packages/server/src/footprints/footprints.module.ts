import { Module, forwardRef } from '@nestjs/common';
import { FootprintsService } from './footprints.service';
import { FootprintsResolver } from './footprints.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { FootprintSchema } from './footprints.schema';
import { UsersModule } from '../users/users.module';
import { NewsFeedModule } from '../news-feed/news-feed.module';
import { LikesModule } from '../likes/likes.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Footprint', schema: FootprintSchema }]),
    forwardRef(() => NewsFeedModule),
    forwardRef(() => UsersModule),
    forwardRef(() => LikesModule),
  ],
  providers: [FootprintsService, FootprintsResolver],
  exports: [FootprintsService],
})
export class FootprintsModule {}
