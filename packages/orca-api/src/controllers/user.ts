import { Request, Response } from 'express';
import { getNewMembers, getUserById, getUsers, onlineUsers, updateUser, updateUserBanned } from '../db';
import { AuthUser, ErrorCodes, ErrorMessages, UserRole } from '../constants';
import { uploadToCloudinary } from '../utils/cloudinary';

const UserController = {
  user: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const user = await getUserById(id, true);
    return res.send(user);
  },
  getUsers: async (req: Request, res: Response): Promise<any> => {
    const authUser = req.user as AuthUser;
    const { offset, limit, emailVerified } = req.query;
    const users = await getUsers(+offset, +limit, authUser?._id, emailVerified === 'true', true);
    return res.send(users);
  },
  onlineUsers: async (req: Request, res: Response): Promise<any> => {
    const authUser = req.user as AuthUser;
    const users = await onlineUsers(authUser?._id);
    return res.send(users);
  },
  newMembers: async (req: Request, res: Response): Promise<any> => {
    const authUser = req.user as AuthUser;
    const users = await getNewMembers(authUser?._id);
    return res.send(users);
  },
  uploadPhoto: async (req: Request, res: Response): Promise<any> => {
    const { imagePublicId, coverImagePublicId, isCover } = req.body;
    const authUser = req.user as AuthUser;
    const image = req.file;

    if (!image) {
      return res.status(ErrorCodes.Bad_Request).send('Please upload an image.');
    }
    if (image && !image.mimetype.match(/image-*/)) {
      return res.status(ErrorCodes.Bad_Request).send('Please upload an image.');
    }

    const coverOrImagePublicId = isCover === 'true' ? coverImagePublicId : imagePublicId;
    const uploadImage = await uploadToCloudinary(image, 'user', coverOrImagePublicId);

    if (uploadImage.secure_url) {
      const fieldsToUpdate: any = {};

      if (isCover === 'true') {
        fieldsToUpdate.coverImage = uploadImage.secure_url;
        fieldsToUpdate.coverImagePublicId = uploadImage.public_id;
      } else {
        fieldsToUpdate.image = uploadImage.secure_url;
        fieldsToUpdate.imagePublicId = uploadImage.public_id;
      }

      const updatedUser = await updateUser(authUser._id, fieldsToUpdate);
      return res.send(updatedUser);
    }

    return res.status(ErrorCodes.Internal).send(ErrorMessages.Generic);
  },
  banUser: async (req: Request, res: Response): Promise<any> => {
    const { id, banned } = req.body;

    const user = await getUserById(id);

    if (user.role === UserRole.SuperAdmin) {
      return res.status(ErrorCodes.Bad_Request).send(`You can't ban Super Admin users!`);
    }

    const bannedUser = await updateUserBanned(id, banned);

    return res.send(bannedUser);
  },
};

export default UserController;
