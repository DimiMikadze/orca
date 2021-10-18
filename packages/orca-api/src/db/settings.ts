// @ts-nocheck
import Settings from '../models/settings';
import User from '../models/user';

export const getSettings = async (): Promise<any> => {
  const settings = await Settings.findOne({});
  return settings;
};

export const createCommunity = async (
  communityName: string,
  primaryColor: boolean,
  isEmailVerificationRequired: boolean,
  facebookLoginEnabled: boolean,
  googleLoginEnabled: boolean,
  githubLoginEnabled: boolean
): Promise<any> => {
  const newSettings = await Settings.create({
    communityName,
    primaryColor,
    isEmailVerificationRequired,
    facebookLoginEnabled,
    googleLoginEnabled,
    githubLoginEnabled,
  });
  return newSettings;
};

export const updateCommunity = async (
  communityName: string,
  primaryColor: boolean,
  isEmailVerificationRequired: boolean,
  facebookLoginEnabled: boolean,
  googleLoginEnabled: boolean,
  githubLoginEnabled: boolean
): Promise<any> => {
  const settings = await getSettings();
  const updatedSettings = await Settings.findOneAndUpdate(
    { _id: settings._id },
    {
      communityName,
      primaryColor,
      isEmailVerificationRequired,
      facebookLoginEnabled,
      googleLoginEnabled,
      githubLoginEnabled,
    },
    { new: true, upsert: true }
  );
  return updatedSettings;
};

export const updateProfile = async (id: string, fullName: string, username: string): Promise<any> => {
  const user = await User.findOneAndUpdate({ _id: id }, { fullName, username }, { new: true });
  return user;
};

export const updatePassword = async (id: string, password: string): Promise<any> => {
  const user = await User.findOneAndUpdate({ _id: id }, { password }, { new: true });
  return user;
};

export const updateLogo = async (logo: string, logoPublicId: string): Promise<any> => {
  const settings = await getSettings();
  if (!settings) {
    const newSettings = await Settings.create({ communityLogo: logo, communityLogoPublicId: logoPublicId });
    return newSettings;
  } else {
    const updatedSettings = await Settings.findOneAndUpdate(
      { _id: settings._id },
      { communityLogo: logo, communityLogoPublicId: logoPublicId },
      { new: true, upsert: true }
    );
    return updatedSettings;
  }
};

export const settingsCreateUser = async (
  fullName: string,
  email: string,
  password: string,
  role: string
): Promise<any> => {
  const user = await User.create({
    fullName,
    email,
    password,
    role,
    emailVerified: true,
  });
  return user;
};
