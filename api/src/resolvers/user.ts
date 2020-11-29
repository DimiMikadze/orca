import mongoose from 'mongoose';
import { withFilter, AuthenticationError } from 'apollo-server';

import { uploadToCloudinary } from '../utils/cloudinary';
import { pubSub } from '../apollo-server';

import { Subscriptions } from '../constants/Subscriptions';
import { Resolvers } from '../generated-graphql';
import { UserRole } from '../constants/types';

export const assertAuthenticated = (authUser) => {
  if (!authUser) {
    throw new AuthenticationError('You need to be logged in');
  }
};

export const assertAdmin = (authUser) => {
  assertAuthenticated(authUser);

  if (UserRole.Admin > authUser.role) {
    throw new AuthenticationError('You need to be a admin');
  }
};

const UserResolver: Resolvers = {
  Query: {
    getAuthUser: async (root, args, { authUser, Message, User }) => {
      if (!authUser) return null;

      // If user is authenticated, update it's isOnline field to true
      const user = await User.findOneAndUpdate({ email: authUser.email }, { isOnline: true })
        .populate({ path: 'posts', options: { sort: { createdAt: 'desc' } } })
        .populate('likes')
        .populate('followers')
        .populate('following')
        .populate({
          path: 'notifications',
          populate: [
            { path: 'author' },
            { path: 'follow' },
            { path: 'like', populate: { path: 'post' } },
            { path: 'comment', populate: { path: 'post' } },
          ],
          match: { seen: false },
        });

      user.newNotifications = user.notifications;

      // Find unseen messages
      const lastUnseenMessages = await Message.aggregate([
        {
          $match: {
            receiver: mongoose.Types.ObjectId(authUser.id),
            seen: false,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $group: {
            _id: '$sender',
            doc: {
              $first: '$$ROOT',
            },
          },
        },
        { $replaceRoot: { newRoot: '$doc' } },
        {
          $lookup: {
            from: 'users',
            localField: 'sender',
            foreignField: '_id',
            as: 'sender',
          },
        },
      ]);

      // Transform data
      const newConversations = [];
      lastUnseenMessages.map((u) => {
        const user = {
          id: u.sender[0]._id,
          username: u.sender[0].username,
          fullName: u.sender[0].fullName,
          image: u.sender[0].image,
          lastMessage: u.message,
          lastMessageCreatedAt: u.createdAt,
        };

        newConversations.push(user);
      });

      // Sort users by last created messages date
      const sortedConversations = newConversations.sort((a, b) =>
        b.lastMessageCreatedAt.toString().localeCompare(a.lastMessageCreatedAt)
      );

      // Attach new conversations to auth User
      user.newConversations = sortedConversations;

      return user;
    },
    getUser: async (root, { username, id }, { User, authUser }) => {
      if (!username && !id) {
        throw new Error('username or id is required params.');
      }

      if (username && id) {
        throw new Error('please pass only username or only id as a param');
      }

      assertAuthenticated(authUser);

      const query = username ? { username: username } : { _id: id };
      const user = await User.findOne(query)
        .populate({
          path: 'posts',
          populate: [
            {
              path: 'author',
              populate: [
                { path: 'followers' },
                { path: 'following' },
                {
                  path: 'notifications',
                  populate: [{ path: 'author' }, { path: 'follow' }, { path: 'like' }, { path: 'comment' }],
                },
              ],
            },
            { path: 'comments', populate: { path: 'author' } },
            { path: 'likes' },
          ],
          options: { sort: { createdAt: 'desc' } },
        })
        .populate('likes')
        .populate('followers')
        .populate('following')
        .populate({
          path: 'notifications',
          populate: [{ path: 'author' }, { path: 'follow' }, { path: 'like' }, { path: 'comment' }],
        });

      if (!user) {
        throw new Error("User with given params doesn't exists.");
      }

      return user;
    },
    getUserPosts: async (root, { username, skip, limit }, { User, Post }) => {
      const user = await User.findOne({ username }).select('_id');

      const query = { author: user._id };
      const count = await Post.find(query).countDocuments();
      const posts = await Post.find(query)
        .populate({
          path: 'author',
          populate: [
            { path: 'following' },
            { path: 'followers' },
            {
              path: 'notifications',
              populate: [{ path: 'author' }, { path: 'follow' }, { path: 'like' }, { path: 'comment' }],
            },
          ],
        })
        .populate('likes')
        .populate({
          path: 'comments',
          options: { sort: { createdAt: 'desc' } },
          populate: { path: 'author' },
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: 'desc' });

      return { posts, count };
    },
    getUsers: async (root, { userId, skip, limit }, { User, Follow }) => {
      // Find user ids, that current user follows
      const userFollowing = [];
      const follow = await Follow.find({ follower: userId }, { _id: 0 }).select('user');
      follow.map((f) => userFollowing.push(f.user));

      // Find users that user is not following
      const query = {
        $and: [{ _id: { $ne: userId } }, { _id: { $nin: userFollowing } }],
      };
      const count = await User.where(query).countDocuments();
      const users = await User.find(query)
        .populate('followers')
        .populate('following')
        .populate({
          path: 'notifications',
          populate: [{ path: 'author' }, { path: 'follow' }, { path: 'like' }, { path: 'comment' }],
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: 'desc' });

      return { users, count };
    },
    searchUsers: async (root, { searchQuery }, { User, authUser }) => {
      // Return an empty array if searchQuery isn't presented
      if (!searchQuery) {
        return [];
      }

      const users = User.find({
        $or: [{ username: new RegExp(searchQuery, 'i') }, { fullName: new RegExp(searchQuery, 'i') }],
        _id: {
          $ne: authUser.id,
        },
      }).limit(50);

      return users;
    },
    suggestPeople: async (root, { userId }, { User, Follow }) => {
      const LIMIT = 6;

      // Find who user follows
      const userFollowing = [];
      const following = await Follow.find({ follower: userId }, { _id: 0 }).select('user');
      following.map((f) => userFollowing.push(f.user));
      userFollowing.push(userId);

      // Find random users
      const query = { _id: { $nin: userFollowing } };
      const usersCount = await User.where(query).countDocuments();
      let random = Math.floor(Math.random() * usersCount);

      const usersLeft = usersCount - random;
      if (usersLeft < LIMIT) {
        random = random - (LIMIT - usersLeft);
        if (random < 0) {
          random = 0;
        }
      }

      const randomUsers = await User.find(query).skip(random).limit(LIMIT);

      return randomUsers;
    },
  },

  Mutation: {
    uploadUserPhoto: async (root, { input: { id, image, imagePublicId, isCover } }, { User }) => {
      const { createReadStream } = await image;
      const stream = createReadStream();
      const uploadImage = await uploadToCloudinary(stream, 'user', imagePublicId);

      if (uploadImage.secure_url) {
        interface FieldsToUpdate {
          coverImage?: string;
          coverImagePublicId?: string;
          image?: string;
          imagePublicId?: string;
        }

        const fieldsToUpdate: FieldsToUpdate = {};
        if (isCover) {
          fieldsToUpdate.coverImage = uploadImage.secure_url;
          fieldsToUpdate.coverImagePublicId = uploadImage.public_id;
        } else {
          fieldsToUpdate.image = uploadImage.secure_url;
          fieldsToUpdate.imagePublicId = uploadImage.public_id;
        }

        const updatedUser = await User.findOneAndUpdate({ _id: id }, { ...fieldsToUpdate }, { new: true })
          .populate('posts')
          .populate('likes');

        return updatedUser;
      }

      throw new Error('Something went wrong while uploading image to Cloudinary.');
    },
  },

  Subscription: {
    isUserOnline: {
      subscribe: withFilter(
        () => pubSub.asyncIterator(Subscriptions.Is_User_Online),
        (payload, variables, { authUserId }) => variables.authUserId === authUserId
      ),
    },
  },
};

export default UserResolver;
