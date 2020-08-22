const Mutation = {
  /**
   * Creates a post comment
   *
   * @param {string} comment
   * @param {string} author author id
   * @param {string} postId
   */
  createComment: async (
    root,
    { input: { comment, postId } },
    { Comment, Post, User, authUser }
  ) => {
    const newComment = await new Comment({
      comment,
      author: authUser.id,
      post: postId,
    }).save();

    // Push comment to post collection
    await Post.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: newComment.id } }
    );
    // Push comment to user collection
    await User.findOneAndUpdate(
      { _id: authUser.id },
      { $push: { comments: newComment.id } }
    );

    return newComment;
  },
  /**
   * Deletes a post comment
   *
   * @param {string} id
   */
  deleteComment: async (root, { input: { id } }, { Comment, User, Post, authUser }) => {
    const comment = await Comment.findOneAndRemove({_id: id, author: authUser.id})

    // Delete comment from users collection
    await User.findOneAndUpdate(
      { _id: comment.author },
      { $pull: { comments: comment.id } }
    );
    // Delete comment from posts collection
    await Post.findOneAndUpdate(
      { _id: comment.post },
      { $pull: { comments: comment.id } }
    );

    return comment;
  },
};

export default { Mutation };
