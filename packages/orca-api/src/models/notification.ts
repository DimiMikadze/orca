import mongoose from 'mongoose';

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

export default mongoose.model('Notification', NotificationSchema);
