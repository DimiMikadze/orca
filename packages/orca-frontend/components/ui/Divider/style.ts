import styled from 'styled-components';
import { DividerProps } from './Divider';

export const Root = styled.div<DividerProps>`
  width: 100%;
  height: 1px;
  background-color: ${(p) =>
    p.backgroundColorTone ? p.theme.colors.grey[p.backgroundColorTone] : p.theme.colors.grey[30]};
  margin: ${(p) => (p.spacing ? `${p.theme.spacing[p.spacing]} auto` : 0)};
`;
