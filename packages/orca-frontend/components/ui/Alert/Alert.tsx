import { FC, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { AlertActionTypes, AlertAlignment, AlertTypes, closeAlert } from '../../../store/alert';
import { Button } from '../../ui';
import { CloseIcon } from '../icons';
import { Root } from './style';

export interface AlertProps {
  children: React.ReactNode;
  type: AlertTypes;
  autoClose: boolean;
  alignment: AlertAlignment;
}

const Alert: FC<AlertProps> = ({ children, type, autoClose, alignment }) => {
  const dispatch = useDispatch<Dispatch<AlertActionTypes>>();

  const close = useCallback(() => {
    dispatch(closeAlert());
  }, [dispatch]);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        close();
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [dispatch, autoClose, close]);

  return (
    <Root type={type} alignment={alignment}>
      {children}
      <Button ghost onClick={close}>
        <CloseIcon color="white" width="10" />
      </Button>
    </Root>
  );
};

export default Alert;
