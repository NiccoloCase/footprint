import { Schema, Document, Types } from 'mongoose';
import { Friendship } from '../graphql';

export type IFriendshipModel = Document & Friendship;

export const FriendshipSchema = new Schema({
  // Utente segutito
  target: { type: Types.ObjectId, required: true, ref: 'User' },
  // Utente che segue
  user: { type: Types.ObjectId, required: true, ref: 'User' },
});

FriendshipSchema.index({ target: 1 });
FriendshipSchema.index({ user: 1 });
FriendshipSchema.index({ target: 1, user: 1 });
