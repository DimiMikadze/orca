import mongoose, { Document, Schema, Model } from 'mongoose';

export interface INotification extends Document {
  author: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  like: mongoose.Types.ObjectId;
  follow: mongoose.Types.ObjectId;
  comment: mongoose.Types.ObjectId;
  message: mongoose.Types.ObjectId;
  seen: boolean;
}

const NotificationSchema = new Schema<INotification, Model<INotification>>(
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
    message: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
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

export default mongoose.model<INotification, Model<INotification>>('Notification', NotificationSchema);
