import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import config from '@footprint/config';

@Module({
  imports: [
    // DATABASE
    MongooseModule.forRoot(config.database.URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      connectionFactory: connection => {
        connection.plugin(require('mongoose-unique-validator'));
        return connection;
      },
    }),
    // GRAPHQL
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      path: '/api/graphql',
      debug: !config.IS_PRODUCTION,
      playground: !config.IS_PRODUCTION,
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
    }),
    // SERVIZI DELL'APPLICAZIONE
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
