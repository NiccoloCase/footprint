import { Schema, Document, Types } from 'mongoose';
import { PointSchema } from '../shared/mongoose';
import { Location } from '../graphql';

export interface IFootprint {
  id: string;
  authorId: string;
  title: string;
  body: string;
  location: Location;
  media: string;
  created_at?: string;
  likesCount?: number;
  commentsCount?: number;
}

export type IFootprintModel = Document & IFootprint;

export const FootprintSchema = new Schema({
  // Autore
  authorId: {
    type: Types.ObjectId,
    required: true,
  },
  // Titolo
  title: {
    type: String,
    required: true,
  },
  // Contenuto
  body: {
    type: String,
  },
  // Foto-video
  media: {
    type: String,
  },
  // Posizione
  location: {
    type: PointSchema,
    required: true,
  },
  // Data di creazione
  created_at: {
    type: Date,
    default: Date.now,
  },
  // Numero di likes
  likesCount: { type: Number, default: 0 },
  // Numero di commenti
  commentsCount: { type: Number, default: 0 },
});

FootprintSchema.index({ authorId: 1 });
FootprintSchema.index({ location: '2dsphere' });
