import { Request, Response } from 'express';
import { AuthUser } from '../constants';
import { searchAll, searchUsers } from '../db';
import { IPost } from '../models/post';
import { IUser } from '../models/user';

const searchController = {
  search: async (req: Request, res: Response<(IUser | IPost)[]>): Promise<Response<(IUser | IPost)[]>> => {
    const { searchQuery } = req.params;
    const authUser = req.user as AuthUser;
    const result = await searchAll(searchQuery, authUser?._id);
    return res.send(result);
  },
  searchUsers: async (req: Request, res: Response<IUser[]>): Promise<Response<IUser[]>> => {
    const { searchQuery } = req.params;
    const authUser = req.user as AuthUser;
    const users = await searchUsers(searchQuery, authUser?._id);
    return res.send(users);
  },
};

export default searchController;
