import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ILike extends Document {
  post: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
}

const LikeSchema = new Schema<ILike, Model<ILike>>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ILike, Model<ILike>>('Like', LikeSchema);
