import mongoose, { Document } from 'mongoose';

import { IUser } from './user';

const Schema = mongoose.Schema;

export interface IFollow extends Document {
  user: IUser['_id'];
  follower: IUser['_id'];
  createdAt: string;
  updatedAt: string;
}

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

export default mongoose.model<IFollow>('Follow', FollowSchema);
