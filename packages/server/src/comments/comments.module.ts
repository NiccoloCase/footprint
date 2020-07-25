import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentBucketSchema } from './comments.schema';
import { UsersModule } from '../users/users.module';
import { FootprintsModule } from '../footprints/footprints.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'CommentBucket',
        collection: 'comments_buckets',
        schema: CommentBucketSchema,
      },
    ]),
    UsersModule,
    FootprintsModule,
  ],
  providers: [CommentsService, CommentsResolver],
})
export class CommentsModule {}
