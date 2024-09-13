import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IFollow extends Document {
  user: mongoose.Types.ObjectId;
  follower: mongoose.Types.ObjectId;
}

const FollowSchema = new Schema<IFollow, Model<IFollow>>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    follower: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IFollow, Model<IFollow>>('Follow', FollowSchema);
