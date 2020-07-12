import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipResolver } from './friendship.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendshipSchema } from './friendship.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Friendship', schema: FriendshipSchema },
    ]),
    UsersModule,
  ],
  providers: [FriendshipService, FriendshipResolver],
})
export class FriendshipModule {}
