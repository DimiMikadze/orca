import mongoose, { Document } from 'mongoose';

import { Message } from '../generated-graphql';

type MessageModel = Message & Document;

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    message: String,
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<MessageModel>('Message', MessageSchema);
