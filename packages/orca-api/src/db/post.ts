// @ts-nocheck
import Post from '../models/post';
import Channel from '../models/channel';
import User from '../models/user';
import Like from '../models/like';
import Comment from '../models/comment';
import Notification from '../models/notification';
import Follow from '../models/follow';

export const postById = async (id: string): Promise<any> => {
  const post = await Post.findById(id);
  return post;
};

export const getFollowedPosts = async (userId: string, offset: number, limit: number): Promise<any> => {
  const userFollowing = [];
  const follow = await Follow.find({ follower: userId }, { _id: 0 }).select('user');
  follow.map((f) => userFollowing.push(f.user));
  const posts = await Post.find({
    $or: [{ author: { $in: userFollowing } }, { author: userId }],
  })
    .populate({
      path: 'author',
      select: '-password',
      populate: [
        { path: 'following' },
        { path: 'followers' },
        {
          path: 'notifications',
          populate: [
            { path: 'author', select: '-password' },
            { path: 'follow' },
            { path: 'like' },
            { path: 'comment' },
          ],
        },
      ],
    })
    .populate('likes')
    .populate('channel')
    .populate({
      path: 'comments',
      options: { sort: { createdAt: 'asc' } },
      populate: { path: 'author', select: '-password' },
    })
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: 'desc' });

  return posts.filter((p: any) => p?.author?.banned !== true);
};

export const getChannelPosts = async (channelId: any): Promise<any> => {
  const posts: any = await Post.find({ channel: channelId });
  return posts;
};

export const getPostsByChannelId = async (channelId: any, offset: number, limit: number): Promise<any> => {
  const posts = await Post.find({ channel: channelId })
    .populate({
      path: 'author',
      select: '-password',
      populate: [
        {
          path: 'notifications',
          populate: [{ path: 'author', select: '-password' }, { path: 'like' }, { path: 'comment' }],
        },
      ],
    })
    .populate('likes')
    .populate({
      path: 'comments',
      options: { sort: { createdAt: 'asc' } },
      populate: { path: 'author', select: '-password' },
    })
    .populate('channel')
    .skip(offset)
    .limit(limit)
    .sort([
      ['pinned', -1],
      ['createdAt', -1],
    ]);

  return posts.filter((p: any) => p?.author?.banned !== true);
};

export const getPostsByAuthorId = async (authorId: any, offset: number, limit: number): Promise<any> => {
  const posts = await Post.find({ author: authorId })
    .populate({
      path: 'author',
      select: '-password',
      populate: [
        {
          path: 'notifications',
          populate: [{ path: 'author', select: '-password' }, { path: 'like' }, { path: 'comment' }],
        },
      ],
    })
    .populate('likes')
    .populate({
      path: 'comments',
      options: { sort: { createdAt: 'asc' } },
      populate: { path: 'author', select: '-password' },
    })
    .populate('channel')
    .skip(offset)
    .limit(limit)
    .sort([
      ['pinned', -1],
      ['createdAt', -1],
    ]);

  return posts;
};

export const getPostById = async (id: string): Promise<any> => {
  const post = await Post.findById(id)
    .populate({
      path: 'author',
      select: '-password',
      populate: [
        {
          path: 'notifications',
          populate: [{ path: 'author', select: '-password' }, { path: 'like' }, { path: 'comment' }],
        },
      ],
    })
    .populate('likes')
    .populate({
      path: 'comments',
      options: { sort: { createdAt: 'asc' } },
      populate: { path: 'author', select: '-password' },
    })
    .populate('channel');
  return post;
};

export const createPost = async (
  title: string,
  imageUrl: string,
  imagePublicId: string,
  channelId: string,
  authorId: string
): Promise<any> => {
  const newPost = await new Post({
    title,
    image: imageUrl,
    imagePublicId,
    channel: channelId,
    author: authorId,
  }).save();

  await newPost.populate('channel').populate('author').execPopulate();

  // Push Post to Channel collection.
  await Channel.findOneAndUpdate({ _id: channelId }, { $push: { posts: newPost._id } });

  return newPost;
};

export const updatePost = async (
  postId: string,
  title: string,
  imageUrl?: string,
  imagePublicId?: string,
  imageToDeletePublicId?: string,
  channelId: string
): Promise<any> => {
  const fields = {
    title,
    channel: channelId,
  };

  // If imageUrl and imagePublicId are defined, the user has uploaded a new image. Hence we need to update these fields.
  if (imageUrl && imagePublicId) {
    fields.image = imageUrl;
    fields.imagePublicId = imagePublicId;
    // However, if imageUrl and imagePublicId are not defined and imageToDeletePublicId is defined, a user has deleted an existing image.
  } else if (imageToDeletePublicId) {
    fields.image = '';
    fields.imagePublicId = '';
  }

  const updatedPost = await Post.findOneAndUpdate({ _id: postId }, { ...fields }, { new: true })
    .populate({
      path: 'author',
      select: '-password',
      populate: [
        { path: 'following' },
        { path: 'followers' },
        {
          path: 'notifications',
          populate: [
            { path: 'author', select: '-password' },
            { path: 'follow' },
            { path: 'like' },
            { path: 'comment' },
          ],
        },
      ],
    })
    .populate('likes')
    .populate('channel')
    .populate({
      path: 'comments',
      options: { sort: { createdAt: 'asc' } },
      populate: { path: 'author', select: '-password' },
    });
  return updatedPost;
};

export const deletePost = async (id: string): Promise<any> => {
  const post = await Post.findByIdAndRemove(id);

  // Pull the post from the channel collection.
  await Channel.findOneAndUpdate({ _id: post.channel }, { $pull: { posts: post._id } });
  // Delete the post from the user's collection.
  await User.findOneAndUpdate({ _id: post.author }, { $pull: { posts: post._id } });

  // Delete the post likes from the like's collection.
  await Like.find({ post: post._id }).deleteMany();
  // Delete the post likes from the user's collection.
  post.likes.map(async (likeId) => {
    await User.find({ likes: likeId }).updateMany({ $pull: { likes: likeId } });
  });

  // Delete the post comments from the comment's collection.
  await Comment.find({ post: post._id }).deleteMany();
  // Delete the comments from the user's collection.
  post.comments.map(async (commentId) => {
    await User.find({ comments: commentId }).updateMany({
      $pull: { comments: commentId },
    });
  });

  // Find the user notifications in the user's collection, and remove them.
  const userNotifications = await Notification.find({ post: post._id });
  userNotifications.map(async (notification) => {
    await User.find({ notifications: notification._id }).updateMany({
      $pull: { notifications: notification._id },
    });
  });
  // Remove notifications from the notification's collection.
  await Notification.find({ post: post._id }).deleteMany();

  return post;
};

export const pinPost = async (id: string, pinned: boolean): Promise<any> => {
  const updatedPost = await Post.findOneAndUpdate({ _id: id }, { pinned }, { new: true })
    .populate({
      path: 'author',
      select: '-password',
      populate: [
        { path: 'following' },
        { path: 'followers' },
        {
          path: 'notifications',
          populate: [
            { path: 'author', select: '-password' },
            { path: 'follow' },
            { path: 'like' },
            { path: 'comment' },
          ],
        },
      ],
    })
    .populate('likes')
    .populate('channel')
    .populate({
      path: 'comments',
      options: { sort: { createdAt: 'asc' } },
      populate: { path: 'author', select: '-password' },
    });

  return updatedPost;
};
