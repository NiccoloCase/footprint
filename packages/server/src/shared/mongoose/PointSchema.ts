import { Schema } from 'mongoose';

export const PointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
  locationName: {
    type: String,
    required: true,
  },
});
