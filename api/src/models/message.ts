import mongoose, { Document } from 'mongoose';

import { IUser } from './user';

const Schema = mongoose.Schema;

export interface IMessage extends Document {
  sender: IUser['_id'];
  receiver: IUser['_id'];
  message: string;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
}

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

export default mongoose.model<IMessage>('Message', MessageSchema);
