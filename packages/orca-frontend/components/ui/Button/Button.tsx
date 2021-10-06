import { FC } from 'react';
import { Root } from './style';

import { FontSize, FontWeight, GeneralColors, Radius } from '../../../theme';

export interface ButtonProps {
  children: React.ReactNode;
  size?: FontSize;
  weight?: FontWeight;
  disabled?: boolean;
  radius?: Radius;
  text?: boolean;
  ghost?: boolean;
  fullWidth?: boolean;
  color?: GeneralColors;
  textColor?: GeneralColors;
  inline?: boolean;
  [x: string]: any;
}

const Button: FC<ButtonProps> = ({ children, ...otherProps }) => {
  return <Root {...otherProps}>{children}</Root>;
};

export default Button;
