import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { EmailModule } from './email/email.module';
import { FootprintsModule } from './footprints/footprints.module';
import { SharedModule } from './shared/shared.module';
import { FriendshipModule } from './friendship/friendship.module';
import { NewsFeedModule } from './news-feed/news-feed.module';
import { UploaderModule } from './uploader/uploader.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { keys } from '@footprint/config';
import { AppController } from './app.controller';

@Module({
  imports: [
    // DATABASE
    MongooseModule.forRoot(keys.database.URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      autoIndex: !keys.IS_PRODUCTION,
      connectionFactory: connection => {
        connection.plugin(require('mongoose-unique-validator'));
        return connection;
      },
    }),
    // GRAPHQL
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      path: '/api/graphql',
      debug: !keys.IS_PRODUCTION,
      playground: !keys.IS_PRODUCTION,
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
    }),
    // SERVIZI DELL'APPLICAZIONE
    UsersModule,
    AuthModule,
    TokenModule,
    EmailModule,
    FootprintsModule,
    SharedModule,
    FriendshipModule,
    NewsFeedModule,
    UploaderModule,
    CommentsModule,
    LikesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
