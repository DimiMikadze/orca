import { useStore } from 'store';
import { SET_MESSAGE } from 'store/message';
import { MessageType } from 'constants/MessageType';

/**
 * React hook for dispatching global messages
 */
export const useGlobalMessage = () => {
  const [, dispatch] = useStore();

  const dispatchAction = (text, messageType, autoClose) => {
    dispatch({
      type: SET_MESSAGE,
      payload: {
        type: messageType,
        text: text,
        autoClose,
      },
    });
  };

  const success = (text, autoClose) => dispatchAction(text, MessageType.SUCCESS, autoClose);

  const info = (text, autoClose) => dispatchAction(text, MessageType.INFO, autoClose);

  const warning = (text, autoClose) => dispatchAction(text, MessageType.WARNING, autoClose);

  const error = (text, autoClose) => dispatchAction(text, MessageType.ERROR, autoClose);

  return { success, info, warning, error };
};
