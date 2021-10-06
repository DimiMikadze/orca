import styled from 'styled-components';
import { OverlayProps } from './Overlay';

export const Root = styled.div<OverlayProps>`
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: ${(p) => p.theme.zIndex.xl};
  background-color: rgba(0, 0, 0, ${(p) => (p.transparency ? p.transparency : '0.8')});
`;
