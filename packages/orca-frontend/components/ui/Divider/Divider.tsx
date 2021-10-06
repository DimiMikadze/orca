import { FC } from 'react';
import { GreyColors, Spacing } from '../../../theme';
import { Root } from './style';

export interface DividerProps {
  spacing?: Spacing;
  backgroundColorTone?: GreyColors;
}

const Divider: FC<DividerProps> = (props) => {
  return <Root {...props} />;
};

export default Divider;
