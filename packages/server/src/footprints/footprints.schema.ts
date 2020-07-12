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
});

FootprintSchema.index({ location: '2dsphere' });
