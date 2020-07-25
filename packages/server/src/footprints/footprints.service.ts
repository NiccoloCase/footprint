import {
  Injectable,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { AddFootprintDTO, GetNearFootprintsDTO } from './footprints.dto';
import { LocationType } from '../graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFootprintModel, IFootprint } from './footprints.schema';
import { IUser } from '../users/users.schema';
import { NewsFeedService } from '../news-feed/news-feed.service';

@Injectable()
export class FootprintsService {
  constructor(
    @InjectModel('Footprint')
    private readonly footprintModel: Model<IFootprintModel>,
    @Inject(forwardRef(() => NewsFeedService))
    private readonly newsFeedService: NewsFeedService,
  ) {}

  /**
   * Restituisce il footprint associato all'ID passato
   * @param id
   */
  async findFootprintById(id: string): Promise<IFootprint | null> {
    try {
      const footprint = await this.footprintModel.findById(id);
      return footprint;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  /**
   * Crea un nuovo footprint
   * @param payload
   * @param author
   */
  async createNew(
    payload: AddFootprintDTO,
    author: IUser,
  ): Promise<IFootprint> {
    const { title, body, coordinates, media } = payload;

    const data = {
      authorId: author.id,
      title,
      body,
      media,
      location: { coordinates, type: LocationType.Point },
    };

    try {
      const newFootprint = await this.footprintModel.create(data);

      // Diffonde il footprint appena creato nei news feed di tutti
      // i followers dell'autore
      this.newsFeedService.broadcastFootprint(newFootprint);

      // restituisce il footprint appena creato
      return newFootprint;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * Restituisce tutti i footprint vicini a un punto
   * @param payload
   */
  async findNearFootprints(
    payload: GetNearFootprintsDTO,
  ): Promise<IFootprint[]> {
    const { lat, lng } = payload;
    const maxDistance = payload.maxDistance || 50;
    const minDistance = payload.minDistance || 0;

    const query = {
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $minDistance: minDistance,
          $maxDistance: maxDistance,
        },
      },
    };

    return await this.footprintModel.find(query);
  }

  /**
   * Restituisce tutti i footprint appartenenti a un determinato
   * utente
   * @param authorId
   */
  async findFootprintsByAuthor(authorId: string) {
    return this.footprintModel.find({ authorId });
  }

  /**
   * Incremente diun certo valore il count dei like
   * @param id ID del footprint
   * @param value
   */
  async increaseLikeCounter(id: string, value: number): Promise<void> {
    await this.footprintModel.findByIdAndUpdate(id, {
      $inc: { likesCount: value },
    });
  }
}
