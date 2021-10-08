import React, { FC } from 'react';
import { Root } from './style';

export interface OverlayProps {
  transparency?: string;
  children: React.ReactNode;
}

const Overlay: FC<OverlayProps> = ({ children, transparency }) => {
  return <Root transparency={transparency}>{children}</Root>;
};

export default Overlay;
