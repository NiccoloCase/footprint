import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFriendshipModel } from './friendship.schema';
import { IUserModel, IUser } from '../users/users.schema';
import { PaginationOptions, Friendship } from '../graphql';
import { normalizePaginationOptions } from '../shared/pagination';
import { NewsFeedService } from '../news-feed/news-feed.service';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectModel('Friendship')
    private readonly friendshipModel: Model<IFriendshipModel>,
    @InjectModel('User')
    private readonly userModel: Model<IUserModel>,
    @Inject(forwardRef(() => NewsFeedService))
    private readonly newsFeedService: NewsFeedService,
  ) {}

  /**
   * Restituisce i followers di un utente
   * @param userId
   * @param pagination
   */
  async getFollowers(
    userId: string,
    pagination?: PaginationOptions,
  ): Promise<IUser[]> {
    // impostazioni dell'impaginazione
    const { offset, limit } = normalizePaginationOptions(pagination);

    const docs = await this.friendshipModel
      .find({ target: userId }, { target: 1, _id: 0 })
      .skip(offset)
      .limit(limit)
      .populate('target');

    const followers: IUser[] = docs.map(doc => doc.target) as any;
    return followers;
  }

  /**
   * Restituisce gli id di tutti followers di un utente
   * @param userId
   */
  async getAllFollowersId(userId: string): Promise<Friendship[]> {
    const docs = await this.friendshipModel.find({ target: userId });
    return docs;
  }

  /**
   * Restituisce gli utente seguiti da un utente
   * @param userId
   * @param pagination
   */
  async getFollowing(
    userId: string,
    pagination?: PaginationOptions,
  ): Promise<IUser[]> {
    // impostazioni dell'impaginazione
    const { offset, limit } = normalizePaginationOptions(pagination);

    const docs = await this.friendshipModel
      .find({ user: userId }, { user: 1, _id: 0 })
      .skip(offset)
      .limit(limit)
      .populate('user');

    const following: IUser[] = docs.map(doc => doc.target) as any;
    return following;
  }

  /**
   * Aggiunge un nuovo follower all'utente "target"
   * @param targetUserId Utente segutio
   * @param userId Utente che segue
   */
  async addFollower(targetUserId: string, userId: string): Promise<void> {
    const payload = { target: targetUserId, user: userId };
    let friendship: IFriendshipModel;

    // Controlla se l'amicizia esiste già
    try {
      friendship = await this.friendshipModel.findOne(payload);
      if (friendship) return;
    } catch (err) {
      throw new BadRequestException(err);
    }

    // Controlla che il client non stia cercando di segure se stesso
    if (targetUserId === userId)
      throw new BadRequestException('You are not allowed follow yourself');

    // Controlla se l'utente target esiste e in caso
    // affermativo aggiorna il suo numero di followers
    const target = await this.userModel.findOneAndUpdate(
      { _id: targetUserId },
      { $inc: { followersCount: 1 } },
    );
    if (!target) throw new BadRequestException('Target user does not exist');

    // Aggiorna il numero di persone segute dell'utente che ha
    // eseguito la richiesta
    const user = await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $inc: { followingCount: 1 } },
    );
    if (!user) throw new UnauthorizedException();

    // Genera il documento della nuova amicizia
    try {
      friendship = await this.friendshipModel.create(payload);
    } catch (err) {
      throw new InternalServerErrorException();
    }

    // Aggiunge al feed dell'utente le attività più recenti dell'utente appena seguto (target)
    this.newsFeedService.mergeUsersContentsIntoFeed(userId, targetUserId);
  }

  /**
   * Rimuove un follower
   * @param targetUserId Utente segutio
   * @param userId Utente che segue
   */
  async removeFollower(targetUserId: string, userId: string): Promise<void> {
    const query = { target: targetUserId, user: userId };

    // Controlla se l'amicizia esiste
    try {
      const friendship = await this.friendshipModel.findOne(query);
      if (!friendship) throw 'Friendship does not exist';
    } catch (err) {
      throw new BadRequestException(err);
    }

    // Controlla che il client non stia cercando di smettere di seguire se stesso
    if (targetUserId === userId)
      throw new BadRequestException('You are not allowed unfollow yourself');

    // Controlla se l'utente target esiste e in caso
    // affermativo aggiorna il suo numero di followers
    const target = await this.userModel.findOneAndUpdate(
      { _id: targetUserId },
      { $inc: { followersCount: -1 } },
    );
    if (!target) throw new BadRequestException('Target user does not exist');

    // Aggiorna il numero di persone segute dell'utente che ha
    // eseguito la richiesta
    const user = await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $inc: { followingCount: -1 } },
    );
    if (!user) throw new UnauthorizedException();

    // Rimuove il documento dell'amicizia
    try {
      const { ok } = await this.friendshipModel.deleteOne(query);
      if (!ok) throw new Error();
    } catch (err) {
      throw new InternalServerErrorException();
    }

    // Rimuove dal feed dell'utente le attività più recenti dell'utente "target"
    this.newsFeedService.removeUsersContentsFromFeed(userId, targetUserId);
  }
}
