import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { withFilter } from 'apollo-server';

import { uploadToCloudinary } from '../utils/cloudinary';
import { generateToken } from '../utils/generate-token';
import { sendEmail } from '../utils/email';
import { pubSub } from '../utils/apollo-server';

import { IS_USER_ONLINE } from '../constants/Subscriptions';

const AUTH_TOKEN_EXPIRY = '1y';
const RESET_PASSWORD_TOKEN_EXPIRY = 3600000;

const Query = {
  /**
   * Gets the currently logged in user
   */
  getAuthUser: async (root, args, { authUser, Message, User }) => {
    if (!authUser) return null;

    // If user is authenticated, update it's isOnline field to true
    const user = await User.findOneAndUpdate(
      { email: authUser.email },
      { isOnline: true }
    )
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
    lastUnseenMessages.map(u => {
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
  /**
   * Gets user by username
   *
   * @param {string} username
   */
  getUser: async (root, { username, id }, { User }) => {
    if (!username && !id) {
      throw new Error('username or id is required params.');
    }

    if (username && id) {
      throw new Error('please pass only username or only id as a param');
    }

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
                populate: [
                  { path: 'author' },
                  { path: 'follow' },
                  { path: 'like' },
                  { path: 'comment' },
                ],
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
        populate: [
          { path: 'author' },
          { path: 'follow' },
          { path: 'like' },
          { path: 'comment' },
        ],
      });

    if (!user) {
      throw new Error("User with given params doesn't exists.");
    }

    return user;
  },
  /**
   * Gets user posts by username
   *
   * @param {string} username
   * @param {int} skip how many posts to skip
   * @param {int} limit how many posts to limit
   */
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
            populate: [
              { path: 'author' },
              { path: 'follow' },
              { path: 'like' },
              { path: 'comment' },
            ],
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
  /**
   * Gets all users
   *
   * @param {string} userId
   * @param {int} skip how many users to skip
   * @param {int} limit how many users to limit
   */
  getUsers: async (root, { userId, skip, limit }, { User, Follow }) => {
    // Find user ids, that current user follows
    const userFollowing = [];
    const follow = await Follow.find({ follower: userId }, { _id: 0 }).select(
      'user'
    );
    follow.map(f => userFollowing.push(f.user));

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
        populate: [
          { path: 'author' },
          { path: 'follow' },
          { path: 'like' },
          { path: 'comment' },
        ],
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 'desc' });

    return { users, count };
  },
  /**
   * Searches users by username or fullName
   *
   * @param {string} searchQuery
   */
  searchUsers: async (root, { searchQuery }, { User, authUser }) => {
    // Return an empty array if searchQuery isn't presented
    if (!searchQuery) {
      return [];
    }

    const users = User.find({
      $or: [
        { username: new RegExp(searchQuery, 'i') },
        { fullName: new RegExp(searchQuery, 'i') },
      ],
      _id: {
        $ne: authUser.id,
      },
    }).limit(50);

    return users;
  },
  /**
   * Gets Suggested people for user
   *
   * @param {string} userId
   */
  suggestPeople: async (root, { userId }, { User, Follow }) => {
    const LIMIT = 6;

    // Find who user follows
    const userFollowing = [];
    const following = await Follow.find(
      { follower: userId },
      { _id: 0 }
    ).select('user');
    following.map(f => userFollowing.push(f.user));
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

    const randomUsers = await User.find(query)
      .skip(random)
      .limit(LIMIT);

    return randomUsers;
  },
  /**
   * Verifies reset password token
   *
   * @param {string} email
   * @param {string} token
   */
  verifyResetPasswordToken: async (root, { email, token }, { User }) => {
    // Check if user exists and token is valid
    const user = await User.findOne({
      email,
      passwordResetToken: token,
      passwordResetTokenExpiry: {
        $gte: Date.now() - RESET_PASSWORD_TOKEN_EXPIRY,
      },
    });
    if (!user) {
      throw new Error('This token is either invalid or expired!');
    }

    return { message: 'Success' };
  },
};

const Mutation = {
  /**
   * Signs in user
   *
   * @param {string} emailOrUsername
   * @param {string} password
   */
  signin: async (root, { input: { emailOrUsername, password } }, { User }) => {
    const user = await User.findOne().or([
      { email: emailOrUsername },
      { username: emailOrUsername },
    ]);

    if (!user) {
      throw new Error('User not found.');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid password.');
    }

    return {
      token: generateToken(user, process.env.SECRET, AUTH_TOKEN_EXPIRY),
    };
  },
  /**
   * Signs up user
   *
   * @param {string} fullName
   * @param {string} email
   * @param {string} username
   * @param {string} password
   */
  signup: async (
    root,
    { input: { fullName, email, username, password } },
    { User }
  ) => {
    // Check if user with given email or username already exists
    const user = await User.findOne().or([{ email }, { username }]);
    if (user) {
      const field = user.email === email ? 'email' : 'username';
      throw new Error(`User with given ${field} already exists.`);
    }

    // Empty field validation
    if (!fullName || !email || !username || !password) {
      throw new Error('All fields are required.');
    }

    // FullName validation
    if (fullName.length > 40) {
      throw new Error('Full name no more than 40 characters.');
    }
    if (fullName.length < 4) {
      throw new Error('Full name min 4 characters.');
    }

    // Email validation
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(String(email).toLowerCase())) {
      throw new Error('Enter a valid email address.');
    }

    // Username validation
    const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
    if (!usernameRegex.test(username)) {
      throw new Error(
        'Usernames can only use letters, numbers, underscores and periods.'
      );
    }
    if (username.length > 20) {
      throw new Error('Username no more than 50 characters.');
    }
    if (username.length < 3) {
      throw new Error('Username min 3 characters.');
    }
    const frontEndPages = [
      'forgot-password',
      'reset-password',
      'explore',
      'people',
      'notifications',
      'post',
    ];
    if (frontEndPages.includes(username)) {
      throw new Error("This username isn't available. Please try another.");
    }

    // Password validation
    if (password.length < 6) {
      throw new Error('Password min 6 characters.');
    }

    const newUser = await new User({
      fullName,
      email,
      username,
      password,
    }).save();

    return {
      token: generateToken(newUser, process.env.SECRET, AUTH_TOKEN_EXPIRY),
    };
  },
  /**
   * Requests reset password
   *
   * @param {string} email
   */
  requestPasswordReset: async (root, { input: { email } }, { User }) => {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(`No such user found for email ${email}.`);
    }

    // Set password reset token and it's expiry
    const token = generateToken(
      user,
      process.env.SECRET,
      RESET_PASSWORD_TOKEN_EXPIRY
    );
    const tokenExpiry = Date.now() + RESET_PASSWORD_TOKEN_EXPIRY;
    await User.findOneAndUpdate(
      { _id: user.id },
      { passwordResetToken: token, passwordResetTokenExpiry: tokenExpiry },
      { new: true }
    );

    // Email user reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?email=${email}&token=${token}`;
    const mailOptions = {
      to: email,
      subject: 'Password Reset',
      html: resetLink,
    };

    await sendEmail(mailOptions);

    // Return success message
    return {
      message: `A link to reset your password has been sent to ${email}`,
    };
  },
  /**
   * Resets user password
   *
   * @param {string} email
   * @param {string} token
   * @param {string} password
   */
  resetPassword: async (
    root,
    { input: { email, token, password } },
    { User }
  ) => {
    if (!password) {
      throw new Error('Enter password and Confirm password.');
    }

    if (password.length < 6) {
      throw new Error('Password min 6 characters.');
    }

    // Check if user exists and token is valid
    const user = await User.findOne({
      email,
      passwordResetToken: token,
      passwordResetTokenExpiry: {
        $gte: Date.now() - RESET_PASSWORD_TOKEN_EXPIRY,
      },
    });
    if (!user) {
      throw new Error('This token is either invalid or expired!.');
    }

    // Update password, reset token and it's expiry
    user.passwordResetToken = '';
    user.passwordResetTokenExpiry = '';
    user.password = password;
    await user.save();

    // Return success message
    return {
      token: generateToken(user, process.env.SECRET, AUTH_TOKEN_EXPIRY),
    };
  },
  /**
   * Uploads user Profile or Cover photo
   *
   * @param {string} id
   * @param {obj} image
   * @param {string} imagePublicId
   * @param {bool} isCover is Cover or Profile photo
   */
  uploadUserPhoto: async (
    root,
    { input: { id, image, imagePublicId, isCover } },
    { User }
  ) => {
    const { createReadStream } = await image;
    const stream = createReadStream();
    const uploadImage = await uploadToCloudinary(stream, 'user', imagePublicId);

    if (uploadImage.secure_url) {
      const fieldsToUpdate = {};
      if (isCover) {
        fieldsToUpdate.coverImage = uploadImage.secure_url;
        fieldsToUpdate.coverImagePublicId = uploadImage.public_id;
      } else {
        fieldsToUpdate.image = uploadImage.secure_url;
        fieldsToUpdate.imagePublicId = uploadImage.public_id;
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { ...fieldsToUpdate },
        { new: true }
      )
        .populate('posts')
        .populate('likes');

      return updatedUser;
    }

    throw new Error(
      'Something went wrong while uploading image to Cloudinary.'
    );
  },
};

const Subscription = {
  /**
   * Subscribes to user's isOnline change event
   */
  isUserOnline: {
    subscribe: withFilter(
      () => pubSub.asyncIterator(IS_USER_ONLINE),
      (payload, variables, { authUser }) => variables.authUserId === authUser.id
    ),
  },
};

export default { Query, Mutation, Subscription };
