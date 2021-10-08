import { DefaultCommunity } from '../constants';
import { getSettings } from '../db';

export const checkEmailVerification = async () => {
  const settings = await getSettings();
  const isEmailVerificationRequired = settings
    ? settings.isEmailVerificationRequired
    : DefaultCommunity.isEmailVerificationRequired;

  return isEmailVerificationRequired;
};
