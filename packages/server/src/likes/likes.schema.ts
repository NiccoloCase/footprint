import { Schema, Document, Types } from 'mongoose';
import { IUser } from '../users/users.schema';

export interface ILikeBucket {
  contentId: string;
  page: number;
  likesCount?: number;
  likes: string[];
}

export type ILikeBucketModel = Document & ILikeBucket;

export const LikeBucketSchema = new Schema({
  // ID del contnuto a cui i like sono riferiti
  contentId: { type: Types.ObjectId, required: true },
  // Numero della pagina del bucket
  page: { type: Number, required: true },
  // Numero di like nel bucket
  likesCount: { type: Number, default: 1 },
  // Likes
  likes: [{ type: Types.ObjectId, ref: 'User' }],
});
