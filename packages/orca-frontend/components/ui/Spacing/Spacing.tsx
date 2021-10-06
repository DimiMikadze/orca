import { FC } from 'react';
import { Spacing as SpacingType } from '../../../theme';
import { Root } from './style';

export interface SpacingProps {
  children?: React.ReactNode;
  top?: SpacingType;
  right?: SpacingType;
  bottom?: SpacingType;
  left?: SpacingType;
  inline?: boolean;
  hideOnSm?: boolean;
}

const Spacing: FC<SpacingProps> = ({ children, ...props }) => {
  return <Root {...props}>{children}</Root>;
};

export default Spacing;
