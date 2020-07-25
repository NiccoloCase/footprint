import { Schema, Document, Types, model, Model } from 'mongoose';

export interface INewFeed {
  ownerId: string;
  footprint: string;
  createdAt?: Date;
  isSeen?: boolean;
}

export type INewsFeedModel = Document & INewFeed;

export const NewsFeedSchema = new Schema({
  // Utente a cui è rivolto il feed
  ownerId: { type: Types.ObjectId, required: true },
  // Footprint
  footprint: { type: Types.ObjectId, required: true, ref: 'Footprint' },
  // Data dell'elemento del feed
  createdAt: { type: Date, default: Date.now },
  // Se il destinatario del feed ha visto l'elemento
  isSeen: { type: Boolean, default: false },
});

NewsFeedSchema.index({ ownerId: 1 });
