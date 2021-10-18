import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { AuthUser, ErrorCodes, ErrorMessages, UserRole } from '../constants';
import {
  getSettings,
  updateCommunity,
  updateProfile,
  getUserByUsername,
  getUserByEmail,
  deleteUser,
  settingsCreateUser,
  getUsers,
  updatePassword,
  updateLogo,
  createCommunity,
  countUsers,
} from '../db';
import { checkEmailVerification } from '../utils';
import { uploadToCloudinary } from '../utils/cloudinary';

const SettingsController = {
  settings: async (req: Request, res: Response): Promise<any> => {
    const settings = await getSettings();
    return res.send(settings);
  },
  users: async (req: Request, res: Response): Promise<any> => {
    const { offset, limit, searchQuery } = req.query;
    const users = await getUsers(+offset, +limit, null, false, false, searchQuery as string);
    return res.send(users);
  },
  usersTotal: async (req: Request, res: Response): Promise<any> => {
    const { total, verified } = await countUsers();
    return res.send({ total, verified });
  },
  updateCommunity: async (req: Request, res: Response): Promise<any> => {
    const {
      communityName,
      primaryColor,
      isEmailVerificationRequired,
      facebookLoginEnabled,
      googleLoginEnabled,
      githubLoginEnabled,
    } = req.body;
    const settings = await getSettings();

    if (!settings) {
      const community = await createCommunity(
        communityName,
        primaryColor,
        isEmailVerificationRequired,
        facebookLoginEnabled,
        googleLoginEnabled,
        githubLoginEnabled
      );
      return res.send(community);
    }

    const community = await updateCommunity(
      communityName,
      primaryColor,
      isEmailVerificationRequired,
      facebookLoginEnabled,
      googleLoginEnabled,
      githubLoginEnabled
    );
    return res.send(community);
  },
  updateProfile: async (req: Request, res: Response): Promise<any> => {
    const { fullName, username } = req.body;
    const authUser = req.user as AuthUser;

    const existingUser = await getUserByUsername(username);

    if (existingUser && existingUser._id.toString() !== authUser._id) {
      return res.status(ErrorCodes.Bad_Request).send('A user with a given username already exists.');
    }

    const updatedUser = await updateProfile(authUser._id, fullName, username);
    return res.send(updatedUser);
  },
  updatePassword: async (req: Request, res: Response): Promise<any> => {
    const authUser = req.user as AuthUser;
    const { password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    await updatePassword(authUser._id, passwordHash);
    return res.send('Password updated successfully.');
  },
  uploadLogo: async (req: Request, res: Response): Promise<any> => {
    const { imagePublicId } = req.body;
    const image = req.file;

    if (!image) {
      return res.status(ErrorCodes.Bad_Request).send('Please upload an image.');
    }
    if (image && !image.mimetype.match(/image-*/)) {
      return res.status(ErrorCodes.Bad_Request).send('Please upload an image.');
    }

    const uploadImage = await uploadToCloudinary(image, 'community', imagePublicId);
    if (uploadImage.secure_url) {
      const updatedUser = await updateLogo(uploadImage.secure_url, uploadImage.public_id);
      return res.send(updatedUser);
    }

    return res.status(ErrorCodes.Internal).send(ErrorMessages.Generic);
  },
  createUser: async (req: Request, res: Response): Promise<any> => {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(ErrorCodes.Bad_Request).send('Please fill in all of the fields.');
    }
    if (role !== UserRole.Regular && role !== UserRole.Admin) {
      return res.status(ErrorCodes.Bad_Request).send('You can create only Admin or Regular users.');
    }

    const existingUser = await getUserByEmail(email);
    const isEmailVerificationRequired = await checkEmailVerification();

    if (existingUser && !isEmailVerificationRequired) {
      return res.status(ErrorCodes.Bad_Request).send('The email address is already being used.');
    }

    if (existingUser && isEmailVerificationRequired && existingUser.emailVerified) {
      return res.status(ErrorCodes.Bad_Request).send('The email address is already being used.');
    }

    // We should not duplicate emails in Schema as they are unique.
    // Hence If the email is not verified, and the "isEmailVerificationRequired" is true, we'll remove the old one.
    if (existingUser && isEmailVerificationRequired && !existingUser.emailVerified) {
      await deleteUser(existingUser._id);
    }

    const user = await settingsCreateUser(fullName, email, password, role);

    return res.send(user);
  },
};

export default SettingsController;
