import mongoose, { Document } from 'mongoose';

import { IPost } from './post';
import { IUser } from './user';

const Schema = mongoose.Schema;

export interface IComment extends Document {
  comment: string;
  post: IPost['_id'];
  author: IUser['_id'];
  createdAt: string;
  updatedAt: string;
}

const CommentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IComment>('Comment', CommentSchema);
