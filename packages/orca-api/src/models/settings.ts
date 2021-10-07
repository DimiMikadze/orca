import mongoose from 'mongoose';
import { DefaultCommunity } from '../constants';

const Schema = mongoose.Schema;

const SettingsSchema = new Schema(
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

export default mongoose.model('Settings', SettingsSchema);
