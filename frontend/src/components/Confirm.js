import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from './Form';
import { Spacing } from './Layout';

const Root = styled.div`
  margin: auto;
  background-color: ${p => p.theme.colors.white};
  padding: ${p => p.theme.spacing.sm};
  border-radius: ${p => p.theme.radius.sm};
  z-index: ${p => p.theme.zIndex.sm};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

/**
 * Confirmation component, meant to be rendered inside Modal component
 */
const Confirm = ({ title, onCancel, onOk, cancelText, okText }) => (
  <Root>
    <div>{title}</div>

    <Spacing top="md" />

    <ButtonContainer>
      <Button onClick={onCancel}>{cancelText}</Button>

      <Spacing left="xs">
        <Button color="red" onClick={onOk}>
          {okText}
        </Button>
      </Spacing>
    </ButtonContainer>
  </Root>
);

Confirm.propTypes = {
  title: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  cancelText: PropTypes.string.isRequired,
  okText: PropTypes.string.isRequired,
};

Confirm.defaultProps = {
  title: 'Do you really want to delete this item?',
  cancelText: 'Cancel',
  okText: 'Delete',
};

export default Confirm;
