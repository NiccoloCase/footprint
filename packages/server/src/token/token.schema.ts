import { Schema, Document } from 'mongoose';
import { Token } from '../graphql';

export type ITokenModel = Document & Token;

export const TokenSchema = new Schema({
  _id: { type: Number },
  userId: { type: Schema.Types.ObjectId, required: true },
  scope: {
    type: String,
    enum: ['USER_CONFIRMATION', 'FORGOT_PASSWORD'],
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3600,
    default: Date.now(),
  },
});

TokenSchema.index({ userId: 1, scope: 1 });
