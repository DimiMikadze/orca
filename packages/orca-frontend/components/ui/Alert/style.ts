import styled from 'styled-components';
import { AlertAlignment, AlertTypes } from '../../../store/alert';

interface RootProps {
  alignment: AlertAlignment;
  type: AlertTypes;
}

export const Root = styled.div<RootProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: fixed;
  top: ${(p) => (p.alignment === 'top' ? '40px' : 'auto')};
  bottom: ${(p) => (p.alignment === AlertAlignment.Bottom ? '40px' : 'auto')};
  left: 50%;
  transform: translate(-50%, 0);
  width: 400px;
  z-index: ${(p) => p.theme.zIndex.md};
  padding: ${(p) => p.theme.spacing.xs} ${(p) => p.theme.spacing.sm};
  border-radius: ${(p) => p.theme.radius.sm};
  color: ${(p) => p.theme.colors.general.white};
  background-color: ${(p) => p.theme.colors.general[p.type]};
  box-shadow: ${(p) => p.theme.shadows.sm};
`;
