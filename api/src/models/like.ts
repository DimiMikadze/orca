import mongoose, { Document } from 'mongoose';

import { Like } from '../generated-graphql';

type LikeModel = Like & Document;

const Schema = mongoose.Schema;

const LikeSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<LikeModel>('Like', LikeSchema);
