import { Resolvers } from '../../generated-graphql';

const CommentResolver: Resolvers = {
  Mutation: {
    createComment: async (root, { input: { comment, author, postId } }, { Comment, Post, User }) => {
      const newComment = await new Comment({
        comment,
        author,
        post: postId,
      }).save();

      // Push comment to post and user collection
      await Post.findOneAndUpdate({ _id: postId }, { $push: { comments: newComment.id } });
      await User.findOneAndUpdate({ _id: author }, { $push: { comments: newComment.id } });

      return newComment;
    },
    deleteComment: async (root, { input: { id } }, { Comment, User, Post }) => {
      const comment = await Comment.findByIdAndRemove(id);

      // Delete comment from user and post collection
      await User.findOneAndUpdate({ _id: comment.author }, { $pull: { comments: comment.id } });
      await Post.findOneAndUpdate({ _id: comment.post }, { $pull: { comments: comment.id } });

      return comment;
    },
  },
};

export default CommentResolver;
