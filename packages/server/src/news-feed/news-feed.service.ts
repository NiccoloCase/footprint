import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { INewsFeedModel } from './news-feed.schema';
import { IFootprint } from '../footprints/footprints.schema';
import { FriendshipService } from '../friendship/friendship.service';
import { FootprintsService } from '../footprints/footprints.service';
import { NewsFeedItem, PaginationOptions } from '../graphql';
import { normalizePaginationOptions } from '../shared/pagination';
import { off } from 'process';

@Injectable()
export class NewsFeedService {
  constructor(
    @InjectModel('NewsFeed')
    private readonly newsfeedModel: Model<INewsFeedModel>,
    @Inject(forwardRef(() => FriendshipService))
    private readonly friendshipService: FriendshipService,
    @Inject(forwardRef(() => FootprintsService))
    private readonly footprintsService: FootprintsService,
  ) {}

  /**
   * Restituisce il feed di un utente
   * @param ownerId
   */
  async getNewsFeed(
    ownerId: string,
    pagination?: PaginationOptions,
  ): Promise<INewsFeedModel[]> {
    // impaginazione
    const { limit, offset } = normalizePaginationOptions(pagination);

    const items = await this.newsfeedModel
      .find({ ownerId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate('footprint');

    return items;
  }

  /**
   * Diffonde il footprint nei feed di tutti i followers dell'autore
   * @param footprint
   */
  async broadcastFootprint(footprint: IFootprint): Promise<void> {
    const { authorId, id } = footprint;
    try {
      // recupera i followers dell'autore del footprint
      const follows = await this.friendshipService.getAllFollowersId(authorId);

      // Crea tanti elementi quanti sono gli utenti ai quali deve essere diffuso
      // il footprint
      const newFeedItems = follows.map(follow => {
        return {
          ownerId: follow.user,
          footprint: id,
        };
      });

      // Aggiunge il Footprint al feed dello stesso autore
      newFeedItems.unshift({
        ownerId: authorId,
        footprint: id,
      });

      // salva tutti gli elementi
      await this.newsfeedModel.insertMany(newFeedItems);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * Segna come visualizzato un elemento del feed dell'utente loggato
   * @param feedItemID ID dell'elemento del feed
   * @param loggedUserId ID dell'utente loggato
   */
  async markFeedItemAsSeen(
    feedItemID: string,
    loggedUserId: string,
  ): Promise<void> {
    try {
      // Trova l'elemento del feed
      const item = await this.newsfeedModel.findOne({ _id: feedItemID });
      if (!item) throw new NotFoundException('Item does not exist');
      // Controlla che l'elemento appartenga a colui che ha eseguito la query
      if (String(item.ownerId) !== String(loggedUserId))
        throw new UnauthorizedException('The item is not owned by you');
      // Controlla se l'elemento è già stato "visto"
      if (item.isSeen) return;
      // Modifica l'elemento
      item.isSeen = true;
      await item.save();
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * Aggiunge al feed dell'utente, il cui ID è passato come primo argomento,
   * tutti i footprint dell'utente (passato come secondo argomento )
   * @param feedOwner
   * @param author
   */
  async mergeUsersContentsIntoFeed(
    feedOwner: string,
    author: string,
  ): Promise<void> {
    try {
      // Ottiene tutti i footprint dell'utente
      const footprints = await this.footprintsService.findFootprintsByAuthor(
        author,
      );

      // Genera nuovi documenti per il feed
      const feedItems: Partial<NewsFeedItem>[] = footprints.map(({ id }) => ({
        ownerId: feedOwner,
        footprint: id,
      }));

      // Aggiunge i documenti al feed
      await this.newsfeedModel.insertMany(feedItems);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * Funzione che rimuove dal feed dell'utente passato come primo argomento tutti i
   * contenuti dell'utente passato come secondo argomento
   * @param feedOwner
   * @param author
   */
  async removeUsersContentsFromFeed(
    feedOwner: string,
    author: string,
  ): Promise<void> {
    try {
      // Ottiene tutti i footprint dell'utente
      const footprints = await this.footprintsService.findFootprintsByAuthor(
        author,
      );
      // Array di footprint
      const footprintsIDs = footprints.map(({ id }) => id);

      // Rimuove tutti gli elementi del feed associati
      // ai footprint dell'utente passato
      await this.newsfeedModel.deleteMany({
        footprint: { $in: footprintsIDs },
        ownerId: feedOwner,
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
