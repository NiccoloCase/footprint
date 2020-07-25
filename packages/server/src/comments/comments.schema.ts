import { Schema, Document, Types } from 'mongoose';

export interface IComment {
  text: string;
  authorId: string;
  createdAt?: Date;
}

export interface ICommentBucket {
  contentId: string;
  page: number;
  commentsCount?: number;
  comments: IComment[];
}

export type ICommentBucketModel = Document & ICommentBucket;

export const CommentBucketSchema = new Schema({
  // ID del contnuto acui i commenti sono associati
  contentId: { type: Types.ObjectId, required: true },
  // Numero della pagina del bucket
  page: { type: Number, required: true },
  // Numero di commenti nel bucket
  commentsCount: { type: Number, default: 1 },
  // Commeni
  comments: [
    {
      // Testo del commento
      text: { type: String, required: true },
      // ID dell'autore del commento
      authorId: { type: Types.ObjectId, required: true },
      // Data di creazione del commento
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

CommentBucketSchema.index({ contentId: 1 });
