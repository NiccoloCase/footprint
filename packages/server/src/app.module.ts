import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import config from '@footprint/config';

@Module({
  imports: [
    // DATABASE
    MongooseModule.forRoot(config.database.URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }),
    // GRAPHQL
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      path: config.server.GRAPHQL_PATH,
      debug: config.IS_PRODUCTION,
      playground: config.IS_PRODUCTION,
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
    }),
    // SERVIZI DELL'APPLICAZIONE
    UsersModule,
  ],
})
export class AppModule {}
