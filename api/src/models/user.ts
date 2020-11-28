import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

import { IPost } from './post';
import { ILike } from './like';
import { IFollow } from './follow';
import { IComment } from './comment';
import { INotification } from './notification';
import { IMessage } from './message';
import { UserRole } from '../constants/types';

const Schema = mongoose.Schema;

export interface IUser extends Document {
  role: UserRole;
  fullName: string;
  email: string;
  username: string;
  facebookId: string;
  passwordResetToken: string;
  passwordResetTokenExpiry: Date;
  password: string;
  image: string;
  imagePublicId: string;
  coverImage: string;
  coverImagePublicId: string;
  isOnline: boolean;
  posts: IPost['_id'][];
  likes: ILike['_id'][];
  comments: IComment['_id'][];
  followers: IFollow['_id'][];
  following: IFollow['_id'][];
  notifications: INotification['_id'][];
  messages: IMessage['_id'][];
  createdAt: string;
  updatedAt: string;
}

const UserSchema = new Schema(
  {
    role: {
      type: UserRole,
      required: true,
      default: UserRole.User,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    facebookId: String,
    passwordResetToken: String,
    passwordResetTokenExpiry: Date,
    password: {
      type: String,
      required: true,
    },
    image: String,
    imagePublicId: String,
    coverImage: String,
    coverImagePublicId: String,
    isOnline: {
      type: Boolean,
      default: false,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
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
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Follow',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Follow',
      },
    ],
    notifications: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Notification',
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUser>('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  });
});

export default mongoose.model<IUser>('User', UserSchema);
