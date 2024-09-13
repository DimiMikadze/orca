import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  message: string;
  seen: boolean;
}

const MessageSchema = new Schema<IMessage, Model<IMessage>>(
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

export default mongoose.model<IMessage, Model<IMessage>>('Message', MessageSchema);
