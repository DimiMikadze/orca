import { FC } from 'react';
import ResetPassword from '../../components/Auth/ResetPassword';
import Seo from '../../components/Seo';

const ResetPasswordPage: FC = () => {
  return (
    <>
      <Seo title="Reset Password" />
      <ResetPassword />
    </>
  );
};

export default ResetPasswordPage;
