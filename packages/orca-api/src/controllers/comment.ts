import { Request, Response } from 'express';
import { AuthUser, ErrorCodes, ErrorMessages } from '../constants';
import { commentById, createComment, deleteComment } from '../db';
import { IComment } from '../models/comment';

const CommentController = {
  create: async (req: Request, res: Response<IComment | string>) => {
    const authUser = req.user as AuthUser;
    const { comment, postId } = req.body;

    if (!comment) {
      return res.status(ErrorCodes.Internal).send('Please insert a comment.');
    }

    const newComment: IComment = await createComment(comment, authUser._id, postId);
    return res.send(newComment);
  },
  delete: async (req: Request, res: Response<IComment | string>) => {
    const { id } = req.body;
    const authUser = req.user as AuthUser;

    // Check if the comment author is removing the comment.
    const comment: IComment = await commentById(id);
    if (comment.author.toString() === authUser._id.toString()) {
      const deletedComment = await deleteComment(id);
      return res.send(deletedComment);
    }

    return res.status(ErrorCodes.Bad_Request).send(ErrorMessages.Generic);
  },
};

export default CommentController;
