import { Module, forwardRef } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesResolver } from './likes.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeBucketSchema } from './likes.schema';
import { FootprintsModule } from '../footprints/footprints.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'LikeBucket',
        collection: 'likes_buckets',
        schema: LikeBucketSchema,
      },
    ]),
    forwardRef(() => FootprintsModule),
  ],
  providers: [LikesService, LikesResolver],
  exports: [LikesService],
})
export class LikesModule {}
