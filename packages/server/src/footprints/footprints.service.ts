import {
  Injectable,
  BadRequestException,
  forwardRef,
  Inject,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { AddFootprintDTO, GetNearFootprintsDTO } from './footprints.dto';
import { LocationType } from '../graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFootprintModel, IFootprint } from './footprints.schema';
import { IUser, IUserModel } from '../users/users.schema';
import { NewsFeedService } from '../news-feed/news-feed.service';

@Injectable()
export class FootprintsService {
  constructor(
    @InjectModel('Footprint')
    private readonly footprintModel: Model<IFootprintModel>,
    @InjectModel('User')
    private readonly userModel: IUserModel,
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
   * Restituisce i footprints creati dall'utente associato all'id passato
   * @param authorId
   */
  async findFootprintsByUser(authorId: string): Promise<IFootprint[]> {
    try {
      const footprint = await this.footprintModel.find({ authorId });
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
    const { title, body, coordinates, media, locationName } = payload;

    const data = {
      authorId: author.id,
      title,
      body,
      media,
      location: { coordinates, type: LocationType.Point, locationName },
    };

    try {
      const newFootprint = await this.footprintModel.create(data);

      // Incremeneta il numero di footprint dell'utente
      await this.userModel.findByIdAndUpdate(author.id, {
        $inc: { footprintsCount: 1 },
      });

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

  /**
   * Elimina un footprint
   * @param id ID del footprint
   * @param clientId ID dell'utente che ha eseguito la richiesta
   */
  async deleteFootprint(id: string, clientId: string) {
    // Cerca il footprint
    let footprint: IFootprintModel | null;
    try {
      footprint = await this.footprintModel.findById(id);
    } catch (err) {
      throw new BadRequestException();
    }
    // Controlla cje questo esista
    if (!footprint) throw new NotFoundException('The footprint does not exist');
    // Controlla che l'utente che ha eseguito la richiesta sia
    // l'autore del footprint
    if (String(footprint.authorId) !== String(clientId))
      throw new UnauthorizedException(
        'You are not authorized to delete a footprint that is not yours',
      );
    // Elimina il footprint dal database
    await footprint.deleteOne();
    // Elimina la foto da cloudinary
    // TODO
    // La difficoltà risiede nel fatto che si è impossibilitati dal sapere se
    // una determinata foto è stata "rubata" da un altro footprint. In tal caso,
    // eliminandola, si eliminerebbe anche la foto originale.
    // (Possibile soluzione -> refactor della gestione delle risolre caricate =
    // è necessario salvare un documento contentete url, id, e autore nel database)
  }
}
