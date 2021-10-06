import styled from 'styled-components';
import { Layout } from '../../../constants';

export const Root = styled.div`
  background-color: ${(p) => p.theme.colors.general.white};
  position: relative;
  margin-top: -${Layout.HEADER_HEIGHT}px;
  padding-top: ${Layout.HEADER_HEIGHT}px;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;

  @media (min-width: ${(p) => p.theme.screen.md}) {
    border-left: 1px solid ${(p) => p.theme.colors.border.main};
    border-right: 1px solid ${(p) => p.theme.colors.border.main};
  }
`;
