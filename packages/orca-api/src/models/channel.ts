import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ChannelSchema = new Schema(
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

export default mongoose.model('Channel', ChannelSchema);
