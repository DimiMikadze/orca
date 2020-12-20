import { Resolvers } from '../generated-graphql';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';

const PostResolver: Resolvers = {
  Query: {
    getPosts: async (root, { authUserId, skip, limit }, { Post }) => {
      const query = {
        $and: [{ image: { $ne: null } }, { author: { $ne: authUserId } }],
      };
      const postsCount = await Post.find(query).countDocuments();
      const allPosts = await Post.find(query)
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

      return { posts: allPosts, count: postsCount };
    },
    getFollowedPosts: async (root, { userId, skip, limit }, { Post, Follow }) => {
      // Find user ids, that the current user follows.
      const userFollowing = [];
      const follow = await Follow.find({ follower: userId }, { _id: 0 }).select('user');
      follow.map((f) => userFollowing.push(f.user));

      // Find user posts and followed posts by using userFollowing ids array
      const query = {
        $or: [{ author: { $in: userFollowing } }, { author: userId }],
      };
      const followedPostsCount = await Post.find(query).countDocuments();
      const followedPosts = await Post.find(query)
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

      return { posts: followedPosts, count: followedPostsCount };
    },
    getPost: async (root, { id }, { Post }) => {
      const post = await Post.findById(id)
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
          options: { sort: { createdAt: -1 } },
          populate: { path: 'author' },
        });
      return post;
    },
  },

  Mutation: {
    createPost: async (root, { input: { title, image, authorId } }, { Post, User }) => {
      if (!title && !image) {
        throw new Error('Post title or image is required.');
      }

      let imageUrl, imagePublicId;
      if (image) {
        const { createReadStream } = await image;
        const stream = createReadStream();
        const uploadImage = await uploadToCloudinary(stream, 'post');

        if (!uploadImage.secure_url) {
          throw new Error('Something went wrong while uploading image to Cloudinary');
        }

        imageUrl = uploadImage.secure_url;
        imagePublicId = uploadImage.public_id;
      }

      const newPost = await new Post({
        title,
        image: imageUrl,
        imagePublicId,
        author: authorId,
      }).save();

      await User.findOneAndUpdate({ _id: authorId }, { $push: { posts: newPost.id } });

      return newPost;
    },
    deletePost: async (root, { input: { id, imagePublicId } }, { Post, Like, User, Comment, Notification }) => {
      // Remove post image from cloudinary, if imagePublicId is present
      if (imagePublicId) {
        const deleteImage = await deleteFromCloudinary(imagePublicId);

        if (deleteImage.result !== 'ok') {
          throw new Error('Something went wrong while deleting image from Cloudinary');
        }
      }

      const post = await Post.findByIdAndRemove(id);

      // Delete post from authors (users) posts collection
      await User.findOneAndUpdate({ _id: post.author }, { $pull: { posts: post.id } });

      // Delete post likes from likes collection
      await Like.find({ post: post.id }).deleteMany();
      // Delete post likes from users collection
      post.likes.map(async (likeId) => {
        await User.where({ likes: likeId }).update({ $pull: { likes: likeId } });
      });

      // Delete post comments from comments collection
      await Comment.find({ post: post.id }).deleteMany();
      // Delete comments from users collection
      post.comments.map(async (commentId) => {
        await User.where({ comments: commentId }).update({
          $pull: { comments: commentId },
        });
      });

      // Find user notifications in users collection and remove them
      const userNotifications = await Notification.find({ post: post.id });

      userNotifications.map(async (notification) => {
        await User.where({ notifications: notification.id }).update({
          $pull: { notifications: notification.id },
        });
      });
      // Remove notifications from notifications collection
      await Notification.find({ post: post.id }).deleteMany();

      return post;
    },
  },
};

export default PostResolver;
