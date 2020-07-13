import { Module, forwardRef } from '@nestjs/common';
import { FootprintsService } from './footprints.service';
import { FootprintsResolver } from './footprints.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { FootprintSchema } from './footprints.schema';
import { UsersModule } from '../users/users.module';
import { NewsFeedModule } from '../news-feed/news-feed.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Footprint', schema: FootprintSchema }]),
    forwardRef(() => NewsFeedModule),
    UsersModule,
  ],
  providers: [FootprintsService, FootprintsResolver],
  exports: [FootprintsService],
})
export class FootprintsModule {}
