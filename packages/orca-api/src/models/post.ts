import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IPost extends Document {
  title: string;
  image: string;
  imagePublicId: string;
  pinned: boolean;
  channel: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
}

const PostSchema = new Schema<IPost, Model<IPost>>(
  {
    title: String,
    image: String,
    imagePublicId: String,
    pinned: Boolean,
    channel: {
      type: Schema.Types.ObjectId,
      ref: 'Channel',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Like',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPost, Model<IPost>>('Post', PostSchema);
