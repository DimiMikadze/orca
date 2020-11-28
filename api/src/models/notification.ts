import mongoose, { Document } from 'mongoose';

import { Notification } from '../generated-graphql';

type NotificationModel = Notification & Document;

const Schema = mongoose.Schema;

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

export default mongoose.model<NotificationModel>('Notification', NotificationSchema);
