// @ts-nocheck
import Comment from '../models/comment';
import Post from '../models/post';
import User from '../models/user';

export const commentById = async (id: string): Promise<any> => {
  const comment = await Comment.findById(id);
  return comment;
};

export const createComment = async (comment: string, authorId: string, postId: string): Promise<any> => {
  const newComment = await new Comment({
    comment,
    author: authorId,
    post: postId,
  }).save();

  await newComment.populate('author').execPopulate();

  // Push the comment to post and user collection.
  await Post.findOneAndUpdate({ _id: postId }, { $push: { comments: newComment._id } });
  await User.findOneAndUpdate({ _id: authorId }, { $push: { comments: newComment._id } });

  return newComment;
};

export const deleteComment = async (id: string): Promise<any> => {
  const comment = await Comment.findByIdAndRemove(id);

  // Delete the comment from the user and post collection.
  await User.findOneAndUpdate({ _id: comment.author }, { $pull: { comments: comment._id } });
  await Post.findOneAndUpdate({ _id: comment.post }, { $pull: { comments: comment._id } });

  return comment;
};
