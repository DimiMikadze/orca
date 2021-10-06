import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ChannelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    authRequired: {
      type: Boolean,
      default: false,
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

export default mongoose.model('Channel', ChannelSchema);
