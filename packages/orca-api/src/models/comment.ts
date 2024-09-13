import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IComment extends Document {
  comment: string;
  post: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
}

const CommentSchema = new Schema<IComment, Model<IComment>>(
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

export default mongoose.model<IComment, Model<IComment>>('Comment', CommentSchema);
