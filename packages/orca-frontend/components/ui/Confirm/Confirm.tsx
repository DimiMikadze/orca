import React, { FC } from 'react';
import { Root, ButtonContainer, Title } from './style';
import { Spacing, Button, Modal } from '../../ui';

interface ConfirmProps {
  children?: React.ReactNode;
  close: () => void;
  onConfirm: () => void;
  isOpen: boolean;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  hideHeading?: boolean;
}

const Confirm: FC<ConfirmProps> = ({
  children,
  close,
  onConfirm,
  isOpen,
  title,
  confirmText,
  cancelText,
  hideHeading,
}) => {
  return (
    <Modal hideHeading={hideHeading} hideTitleBorder isOpen={isOpen} close={close} hideCloseButton>
      <Title>{title}</Title>
      <Root>
        {children}
        <ButtonContainer>
          <Button type="button" text color="primary" onClick={close}>
            {cancelText}
          </Button>

          <Spacing left="xs">
            <Button type="submit" color="primary" onClick={onConfirm}>
              {confirmText}
            </Button>
          </Spacing>
        </ButtonContainer>
      </Root>
    </Modal>
  );
};

Confirm.defaultProps = {
  confirmText: 'Delete',
  cancelText: 'Cancel',
  title: 'Do you really want to delete this item?',
};

export default Confirm;
