import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

import { SuccessIcon, InfoIcon, WarningIcon, ErrorIcon, CloseIcon } from 'components/icons';
import { Spacing } from './Layout';
import { Button } from 'components/Form';

import theme from 'theme';

import { allMessageTypes } from 'constants/MessageType';

import { useStore } from 'store';
import { CLEAR_MESSAGE } from 'store/message';

const fade = keyframes`
  from {
    bottom: -60px;
    opacity: 0;
  }
  to {
    bottom: 0;
    opacity: 1;
  }
`;

/**
 * Default styles for message
 */
const Root = styled.div`
  position: fixed;
  width: 100%;
  box-shadow: ${(p) => p.theme.shadows.md};
  padding: ${(p) => p.theme.spacing.sm};
  z-index: ${(p) => p.theme.zIndex.xl};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${(p) => p.color && p.color};
  animation: ${fade} 0.3s ease-out forwards;
  color: ${(p) => p.theme.colors.white};
`;

const Close = styled(Button)`
  position: absolute;
  right: 20px;
  top: 24px;
`;

/**
 * Displays global message as feedback in response to user operations
 */
const Message = ({ children, type, autoClose }) => {
  const [, dispatch] = useStore();

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        dispatch({ type: CLEAR_MESSAGE });
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [dispatch, autoClose]);

  const { success, info, warning, error } = theme.colors;

  const Colors = {
    SUCCESS: success,
    INFO: info,
    WARNING: warning,
    ERROR: error.main,
  };

  const MessageType = (type) => {
    const icons = {
      SUCCESS: <SuccessIcon />,
      INFO: <InfoIcon />,
      WARNING: <WarningIcon />,
      ERROR: <ErrorIcon />,
    };

    return icons[type];
  };

  return (
    <Root color={Colors[type]}>
      {MessageType(type)}
      <Spacing left={type && 'xs'}>{children}</Spacing>
      <Close ghost onClick={() => dispatch({ type: CLEAR_MESSAGE })}>
        <CloseIcon color="white" />
      </Close>
    </Root>
  );
};

Message.defaultProps = {
  autoClose: true,
};

Message.propTypes = {
  children: PropTypes.any.isRequired,
  type: PropTypes.oneOf(allMessageTypes),
  autoClose: PropTypes.bool,
};

export default Message;
