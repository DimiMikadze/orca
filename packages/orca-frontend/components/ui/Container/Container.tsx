import { ForwardRefRenderFunction, forwardRef } from 'react';
import { GeneralColors, Radius, Shadows, Spacing, Screen, ZIndex } from '../../../theme';
import { Root } from './style';

export interface ContainerProps {
  children: React.ReactNode;
  marginTop?: Spacing;
  maxWidth?: Screen;
  padding?: Spacing;
  paddingVertical?: Spacing;
  paddingHorizontal?: Spacing;
  zIndex?: ZIndex;
  radius?: Radius;
  bordered?: boolean;
  bgColor?: GeneralColors;
  shadow?: Shadows;
  centered?: boolean;
}

const Container: ForwardRefRenderFunction<HTMLDivElement, ContainerProps> = ({ children, ...props }, ref) => {
  return (
    <Root {...props} ref={ref}>
      {children}
    </Root>
  );
};

export default forwardRef(Container);
