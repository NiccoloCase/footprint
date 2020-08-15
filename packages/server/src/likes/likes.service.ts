import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ILikeBucketModel } from './likes.schema';
import { FootprintsService } from '../footprints/footprints.service';
import { IFootprint } from '../footprints/footprints.schema';
import { IUser } from '../users/users.schema';
import { constants } from '@footprint/config';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel('LikeBucket')
    private readonly likeModel: Model<ILikeBucketModel>,
    private readonly footprintService: FootprintsService,
  ) {}

  async findLikes(contentId: string, page: number = 0): Promise<IUser[]> {
    try {
      const bucket = await this.likeModel
        .findOne({ contentId, page })
        .populate('likes');

      return bucket ? (bucket.likes as any) : [];
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * Crea un nuovo bucket di likes
   */
  async createNewLikeBucket(
    userLike: string,
    contentId: string,
    page: number = 0,
  ): Promise<void> {
    try {
      // Crea un nuovo bucket
      await this.likeModel.create({
        page,
        contentId,
        likes: [userLike],
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * Aggiunge un like a un footprint
   * @param contentId
   * @param userId
   */
  async addLike(contentId: string, userId: string): Promise<void> {
    // Controlla che il contenuto esista
    let content: IFootprint | null;
    try {
      content = await this.footprintService.findFootprintById(contentId);
      if (!content) throw new Error();
    } catch (err) {
      throw new NotFoundException('Content not found');
    }

    // Controlla che l'utente non stia cercando di mettere un like a un suo post
    if (String(content.authorId) === String(userId))
      throw new BadRequestException(
        'You are not allowed to like your own footprint',
      );

    // Controlla se l'utente ha già messo un like al footprint
    try {
      const query: any = {
        contentId,
        likes: Types.ObjectId(userId),
      };
      const bucket = await this.likeModel.findOne(query);
      if (bucket) throw new Error();
    } catch (err) {
      throw new BadRequestException('You already liked this content');
    }

    // Otiene il bucket piu recente
    const lastBucket = await this.likeModel
      .findOne({ contentId })
      .sort('-page')
      .limit(1);

    // Non esiste ancora nessun bucket -> ne crea uno nuovo
    if (!lastBucket) return this.createNewLikeBucket(userId, contentId);

    // Esiste già un bucket:
    // Controlla se questo è pieno
    if (lastBucket.likesCount >= constants.LIKES_PER_BUCKET)
      // Il bucket è pieno -> crea un nuovo bucket
      return this.createNewLikeBucket(userId, contentId, lastBucket.page + 1);

    // Inserisce l'utente nella lista di likes
    lastBucket.likes.unshift(userId);
    // Incrementa il contatore dei likes del bucket
    lastBucket.likesCount += 1;

    // Salva il bucket
    try {
      await lastBucket.save();
    } catch (err) {
      throw new BadRequestException(err);
    }

    // Incrementa il contatore dei likes del footprint
    try {
      await this.footprintService.increaseLikeCounter(contentId, 1);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * Rimuove il like da il contenuto passato
   * @param contentId
   * @param userId
   */
  async removeLike(contentId: string, userId: string): Promise<void> {
    const user = Types.ObjectId(userId);
    let bucket: ILikeBucketModel;

    try {
      const query: any = {
        contentId,
        likes: user,
      };

      const update: any = {
        // elimina il like dall'array
        $pull: { likes: user },
        // diminuisce il numero di like
        $inc: { likesCount: -1 },
      };

      bucket = await this.likeModel.findOneAndUpdate(query, update);
    } catch (err) {
      throw new BadRequestException(err);
    }

    if (!bucket)
      throw new NotFoundException(
        'You can not remove the like of a content that does not exist or that you have not yet liked',
      );

    // Se il bucket è vuoto viene eliminato
    if (bucket.likes.length === 0) await bucket.deleteOne();

    // Decrementa il contatore di likes
    try {
      this.footprintService.increaseLikeCounter(contentId, -1);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
