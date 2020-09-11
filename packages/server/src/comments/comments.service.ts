import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ICommentBucketModel, IComment } from './comments.schema';
import { FootprintsService } from '../footprints/footprints.service';
import { constants } from '@footprint/config';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('CommentBucket')
    private readonly commentModel: Model<ICommentBucketModel>,
    private readonly footprintService: FootprintsService,
  ) {}

  /**
   * Restitituisce i commenti di un bucket
   * @param contentId
   * @param page
   */
  async findComments(contentId: string, page: number = 0): Promise<IComment[]> {
    try {
      const bucket = await this.commentModel
        .findOne({ contentId })
        .sort('-page')
        .skip(page)
        .limit(1);

      return bucket ? bucket.comments : [];
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * Crea un nuovo bucket di commenti
   * @param fristComment
   * @param contentId
   * @param page
   */
  async createNewBucket(
    fristComment: IComment,
    contentId: string,
    page: number = 0,
  ): Promise<IComment> {
    try {
      // Crea un nuovo bucket
      const bucket = await this.commentModel.create({
        page,
        contentId,
        comments: [fristComment],
      });
      return bucket.comments[0];
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * Posta un nuovo commento
   * @param authorId ID dell'autore del commento
   * @param contentId Contenuto al quale è associato
   * @param text Testo del commento
   */
  async createComment(
    authorId: string,
    contentId: string,
    text: string,
  ): Promise<IComment> {
    // Commento che è restituito dalla funzione
    let returnedComment: IComment;

    // Documento del nuovo commento
    const newComment = {
      text,
      authorId,
    };

    const lastBucket = await this.commentModel
      .findOne({ contentId })
      .sort('-page')
      .limit(1);

    // Non esiste ancora nessun bucket
    if (!lastBucket) {
      // Controlla che il contenuto passato esista
      try {
        const content = await this.footprintService.findFootprintById(
          contentId,
        );
        if (!content) throw new Error();
      } catch (err) {
        throw new NotFoundException('Content not found');
      }
      try {
        // Crea un nuovo bucket
        returnedComment = await this.createNewBucket(newComment, contentId);
      } catch (err) {
        throw new InternalServerErrorException(err);
      }
    } else {
      // Controlla se il bucket è pieno
      if (lastBucket.commentsCount >= constants.COMMENTS_PER_BUCKET) {
        try {
          // Crea un nuovo bucket
          returnedComment = await this.createNewBucket(
            newComment,
            contentId,
            lastBucket.page + 1,
          );
        } catch (err) {
          throw new InternalServerErrorException();
        }
      } else {
        // Inserisce il nuovo commento nell'ultimo bucket
        lastBucket.comments.unshift(newComment);
        // Incrementa il contatore di commenti
        lastBucket.commentsCount += 1;

        // Salva il bucket
        try {
          await lastBucket.save();
          returnedComment = lastBucket.comments[0];
        } catch (err) {
          throw new BadRequestException(err);
        }
      }

      // Incrementa il contatore di commenti del footprint
      try {
        await this.footprintService.increaseCommentsCounter(contentId, 1);
      } catch (err) {
        console.error(err);
        throw new InternalServerErrorException();
      }

      return returnedComment;
    }
  }

  /**
   * Elimina un commento
   * @param id ID del commento
   * @param contentId Contenuto al quale è associato
   * @param authorId Autore del commento
   */
  async deleteComment(
    id: string,
    contentId: string,
    authorId: string,
  ): Promise<void> {
    const query = {
      contentId,
      comments: {
        $elemMatch: {
          _id: Types.ObjectId(id),
          authorId: Types.ObjectId(authorId),
        },
      },
    };

    const update: any = {
      // elimina il commento dall'array
      $pull: { comments: { _id: Types.ObjectId(id) } },
      // diminuisce il numero di commenti
      $inc: { commentsCount: -1 },
    };

    const commentBucket = await this.commentModel.findOneAndUpdate(
      query,
      update,
      { new: true },
    );

    // Se non esiste nessun bucket => o il commento non esiste, o l'utente che ha eseguito
    // la richiesta non è l'autore del commento
    if (!commentBucket)
      throw new BadRequestException(
        'The comment does not exist, or you are not the owner of it',
      );

    // Decrementa il contatore di commenti del footprint
    try {
      await this.footprintService.increaseCommentsCounter(contentId, -1);
    } catch (err) {
      throw new InternalServerErrorException();
    }

    // Se il bucket è vuoto viene eliminato
    if (commentBucket.comments.length === 0) await commentBucket.deleteOne();
  }
}
