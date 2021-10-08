import { Request, Response } from 'express';
import { AuthUser, ErrorCodes, ErrorMessages } from '../constants';
import { createFollow, deleteFollow, followById } from '../db';

const FollowController = {
  create: async (req: Request, res: Response): Promise<any> => {
    const { userId } = req.body;
    const authUser = req.user as AuthUser;
    const follow = await createFollow(userId, authUser._id);
    return res.send(follow);
  },
  delete: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.body;
    const authUser = req.user as AuthUser;

    // Check if the follow author is removing the follow.
    const follow: any = await followById(id);
    if (follow.follower.toString() === authUser._id.toString()) {
      const deletedFollow = await deleteFollow(id);
      return res.send(deletedFollow);
    }

    return res.status(ErrorCodes.Bad_Request).send(ErrorMessages.Generic);
  },
};

export default FollowController;
