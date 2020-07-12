import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { FriendshipService } from './friendship.service';
import { Private } from '../auth/auth.guard';
import { CurrentUser } from '../users/user.decorator';
import { IUser } from '../users/users.schema';
import { ProcessResult } from '../graphql';
import { GetFollowersDTO, GetFollowingDTO } from './friendship.dto';

@Resolver('Friendship')
export class FriendshipResolver {
  constructor(private readonly friendshipService: FriendshipService) {}

  // RESTITUISCE I FOLLOWERS DELL'UTENTE PASSATO
  @Query()
  getFollowers(@Args() payload: GetFollowersDTO) {
    const { userId, pagination } = payload;
    return this.friendshipService.getFollowers(userId, pagination);
  }
  // RESTITUISCE LE PERSONE SEGUITE DALL'UTENTE PASSATO
  @Query()
  getFollowing(@Args('userId') payload: GetFollowingDTO) {
    const { userId, pagination } = payload;
    return this.friendshipService.getFollowing(userId, pagination);
  }

  // AGGIUNGE ALLA LISTA DEI FOLLOWERS DELL'UTENTE PASSATO L'UTENTE LOGGATO
  @Mutation()
  @Private()
  async followUser(
    @Args('target') target: string,
    @CurrentUser() user: IUser,
  ): Promise<ProcessResult> {
    await this.friendshipService.addFollower(target, user.id);
    return { success: true };
  }

  // RIMUOVE DALLA LISTA DEI FOLLOWERS DELL'UTENTE PASSATO L'UTENTE LOGGATO
  @Mutation()
  @Private()
  async unfollowUser(
    @Args('target') target: string,
    @CurrentUser() user: IUser,
  ): Promise<ProcessResult> {
    await this.friendshipService.removeFollower(target, user.id);
    return { success: true };
  }
}
