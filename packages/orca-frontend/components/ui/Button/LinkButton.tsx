import { FC } from 'react';
import { Link } from './style';

import { FontSize, FontWeight, GeneralColors, Radius } from '../../../theme';

export interface LinkButtonProps {
  children: React.ReactNode;
  size?: FontSize;
  weight?: FontWeight;
  disabled?: boolean;
  radius?: Radius;
  text?: boolean;
  ghost?: boolean;
  fullWidth?: boolean;
  color?: GeneralColors;
  [x: string]: any;
}

const LinkButton: FC<LinkButtonProps> = ({ children, ...otherProps }) => {
  return <Link {...otherProps}>{children}</Link>;
};

export default LinkButton;
