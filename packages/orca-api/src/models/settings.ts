import mongoose, { Document, Schema, Model } from 'mongoose';
import { DefaultCommunity } from '../constants';

export interface ISettings extends Document {
  communityName: string;
  communityLogo: string;
  communityLogoPublicId: string;
  facebookLoginEnabled: boolean;
  googleLoginEnabled: boolean;
  githubLoginEnabled: boolean;
  primaryColor: string;
  isEmailVerificationRequired: boolean;
}

const SettingsSchema = new Schema<ISettings, Model<ISettings>>(
  {
    communityName: {
      type: String,
      required: true,
      default: DefaultCommunity.communityName,
    },
    communityLogo: {
      type: String,
      default: DefaultCommunity.communityLogo,
    },
    communityLogoPublicId: {
      type: String,
      default: DefaultCommunity.communityLogoPublicId,
    },
    facebookLoginEnabled: {
      type: Boolean,
      default: false,
    },
    googleLoginEnabled: {
      type: Boolean,
      default: false,
    },
    githubLoginEnabled: {
      type: Boolean,
      default: false,
    },
    primaryColor: {
      type: String,
      required: true,
      default: DefaultCommunity.primaryColor,
    },
    isEmailVerificationRequired: {
      type: Boolean,
      required: true,
      default: DefaultCommunity.isEmailVerificationRequired,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISettings, Model<ISettings>>('Settings', SettingsSchema);
