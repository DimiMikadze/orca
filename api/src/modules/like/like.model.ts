import mongoose, { Document } from 'mongoose';

import { IPost } from '../post/post.model';
import { IUser } from '../user/user.model';

const Schema = mongoose.Schema;

export interface ILike extends Document {
  post: IPost['_id'];
  user: IUser['_id'];
  createdAt: string;
  updatedAt: string;
}

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

export default mongoose.model<ILike>('Like', LikeSchema);
