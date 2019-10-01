import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Confirm from './Confirm';
import { Overlay } from './Layout';

const Root = styled.div`
  position: fixed;
  top: ${p => p.theme.spacing.sm};
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${p => p.theme.zIndex.lg};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  @media (min-width: ${p => p.theme.screen.md}) {
    align-items: center;
    top: 0;
  }
`;

/**
 * Main component for rendering Modals
 */
const Modal = ({ children, open, onClose, type, ...otherProps }) => {
  if (!open) return null;

  return (
    <Root>
      <Overlay onClick={onClose} />

      {type === 'confirm' ? <Confirm {...otherProps} /> : children}
    </Root>
  );
};

Modal.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['', 'confirm']),
};

export default Modal;
