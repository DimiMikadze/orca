import mongoose, { Schema, Document, model, Model } from 'mongoose';

// 定义接口
export interface IChannel extends Document {
  name: string;
  description?: string;
  authRequired: boolean;
  order: number;
  posts: mongoose.Types.ObjectId[];
}

// 定义 Schema
const ChannelSchema = new Schema<IChannel, Model<IChannel>>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    authRequired: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: true,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// 导出模型
export default model<IChannel, Model<IChannel>>('Channel', ChannelSchema);
