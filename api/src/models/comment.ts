import mongoose, { Document } from 'mongoose';

import { Comment } from '../generated-graphql';

type CommentModel = Comment & Document;

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<CommentModel>('Comment', CommentSchema);
