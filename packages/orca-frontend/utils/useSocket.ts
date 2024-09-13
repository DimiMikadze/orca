import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Socket, io } from 'socket.io-client';
import { RootState } from '../store';
import { AuthActionTypes, setSocket } from '../store/auth';
import { Config } from '../utils';
import { Dispatch } from 'redux';

const useSocket = (): Socket => {
  const dispatch = useDispatch<Dispatch<AuthActionTypes>>();
  const { socket, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (socket || !user) {
      return;
    }

    const socketInstance = io(Config.SOCKET_IO_URL, {
      withCredentials: true,
    });
    dispatch(setSocket(socketInstance));

    socketInstance.onAny((event, ...args) => {
      console.log(event, args);
    });
  }, [user, dispatch, socket]);

  return socket as Socket;
};

export default useSocket;
