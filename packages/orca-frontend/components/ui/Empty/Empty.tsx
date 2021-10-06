import React, { FC, ReactNode } from 'react';
import { Root } from './style';
import { EmptyIcon } from '../icons';
import Spacing from '../Spacing';

interface EmptyProps {
  children: ReactNode;
}

const Empty: FC<EmptyProps> = ({ children }) => {
  return (
    <Root>
      <EmptyIcon width="80" />
      <Spacing top="md" />
      {children}
    </Root>
  );
};

export default Empty;
