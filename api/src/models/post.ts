import mongoose, { Document } from 'mongoose';

import { Post } from '../generated-graphql';

type PostModel = Post & Document;

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: String,
    image: String,
    imagePublicId: String,
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

export default mongoose.model<PostModel>('Post', PostSchema);
