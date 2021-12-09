import {Schema, model} from 'mongoose';

const ScoreSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  credit: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export const LaserScore = model('LaserScore', ScoreSchema);
export const TankilaScore = model('TankilaScore', ScoreSchema);
