import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PostSchema = new Schema(
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

export default mongoose.model('Post', PostSchema);
