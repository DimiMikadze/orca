import { FC, ReactNode, useEffect } from 'react';

import theme, { Theme } from '../../theme';
import GlobalStyle from '../ui/GlobalStyle/GlobalStyle';
import Alert from '../ui/Alert/Alert';
import { RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth, useFetchSettings, useSocket } from '../../utils';
import { addUserNotification, AuthActionTypes, removeUserNotification } from '../../store/auth';
import { Events } from '../../constants';
import { Loading } from '../ui';
import { Dispatch } from 'redux';

interface AppProps {
  children: ReactNode;
  setTheme: (theme?: Theme) => void;
}

const App: FC<AppProps> = ({ children, setTheme }) => {
  const notification = useSelector((state: RootState) => state.notification);
  const authUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<Dispatch<AuthActionTypes>>();
  const { authError, isAuthFetching } = useAuth();
  const { isSettingsFetching } = useFetchSettings(setTheme);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }

    const createNotificationListener = (data) => {
      if (!authUser) return;
      if (data.user !== authUser._id) return;
      const exists = authUser.notifications.some((n) => n._id === data._id);
      if (!exists) {
        dispatch(addUserNotification(data));
      }
    };

    const deleteNotificationListener = (data) => {
      if (!authUser) return;
      if (data.user !== authUser._id) return;
      const exists = authUser.notifications.some((n) => n._id === data._id);
      if (exists) {
        dispatch(removeUserNotification(data._id));
      }
    };

    socket.on(Events.CREATE_NOTIFICATION_REQUEST, createNotificationListener);
    socket.on(Events.DELETE_NOTIFICATION_REQUEST, deleteNotificationListener);

    return () => {
      socket.off(Events.CREATE_NOTIFICATION_REQUEST, createNotificationListener);
      socket.off(Events.DELETE_NOTIFICATION_REQUEST, deleteNotificationListener);
    };
  }, [authUser, dispatch, socket]);

  if (isAuthFetching || isSettingsFetching) return <Loading top="md" />;
  if (authError) {
    const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
    if (isDevelopment) {
      console.error(authError);
    }
    const devErrorMessage =
      'Sorry, something went wrong. Please open the browser console to view the detailed error message.';
    const prodErrorMessage = "Sorry, something went wrong. We're working on getting this fixed as soon as we can.";
    return <div>{isDevelopment ? devErrorMessage : prodErrorMessage}</div>;
  }

  return (
    <>
      {children}

      <GlobalStyle theme={theme} />

      {notification.message && (
        <Alert autoClose={notification.autoClose} alignment={notification.alignment} type={notification.type}>
          {notification.message}
        </Alert>
      )}
    </>
  );
};

export default App;
