import mongoose, { Document } from 'mongoose';

import { Follow } from '../generated-graphql';

type FollowModel = Follow & Document;

const Schema = mongoose.Schema;

const FollowSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    follower: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<FollowModel>('Follow', FollowSchema);
