import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { AuthActionTypes, closeAuthPopup, PopupType } from '../../store/auth';
import { Modal } from '../ui';
import ForgotPassword from './ForgotPassword';
import Login from './Login';
import SignUp from './SignUp';
import { Dispatch } from 'redux';

const AuthPopup: FC = () => {
  const { isPopupOpen, popupType } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<Dispatch<AuthActionTypes>>();

  const closeModal = () => {
    dispatch(closeAuthPopup());
  };

  const popups = {
    [PopupType.Sign_Up]: {
      title: 'Sign up',
      component: <SignUp />,
    },
    [PopupType.Log_In]: {
      title: 'Log in',
      component: <Login />,
    },
    [PopupType.Forgot_Password]: {
      title: 'Forgot Password',
      component: <ForgotPassword />,
    },
  };

  if (!popups[popupType]) {
    return null;
  }

  return (
    <Modal maxWidth="xs" isOpen={isPopupOpen} close={closeModal} title={popups[popupType].title}>
      {popups[popupType].component}
    </Modal>
  );
};

export default AuthPopup;
