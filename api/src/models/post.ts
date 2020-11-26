import mongoose, { Document } from 'mongoose';

import { IUser } from './user';
import { ILike } from './like';
import { IComment } from './comment';

const Schema = mongoose.Schema;

export interface IPost extends Document {
  title: string;
  image: string;
  imagePublicId: string;
  author: IUser['_id'];
  likes: ILike['_id'][];
  comments: IComment['_id'][];
  createdAt: string;
  updatedAt: string;
}

const PostSchema = new Schema(
  {
    title: String,
    image: String,
    imagePublicId: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Like',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPost>('Post', PostSchema);
