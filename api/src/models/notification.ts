import mongoose, { Document } from 'mongoose';

import { IUser } from './user';
import { IPost } from './post';
import { ILike } from './like';
import { IFollow } from './follow';
import { IComment } from './comment';

const Schema = mongoose.Schema;

export interface INotification extends Document {
  author: IUser['_id'];
  user: IUser['_id'];
  post: IPost['_id'];
  like: ILike['_id'];
  follow: IFollow['_id'];
  comment: IComment['_id'];
  seen: boolean;
  createdAt: string;
  updatedAt: string;
}

const NotificationSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    post: Schema.Types.ObjectId,
    like: {
      type: Schema.Types.ObjectId,
      ref: 'Like',
    },
    follow: {
      type: Schema.Types.ObjectId,
      ref: 'Follow',
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INotification>('Notification', NotificationSchema);
