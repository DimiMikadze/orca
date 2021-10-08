import styled from 'styled-components';
import { Layout } from '../../../constants';

interface RootProps {
  isOpen: boolean;
}

export const Root = styled.div<RootProps>`
  position: fixed;
  top: ${Layout.HEADER_HEIGHT}px;
  left: 0;
  padding-top: ${(p) => p.theme.spacing.sm};
  width: ${Layout.SIDEBAR_MOBILE_WIDTH}px;
  font-size: ${(p) => p.theme.font.size.xxs};
  z-index: ${(p) => p.theme.zIndex.xs};
  height: calc(100vh - ${Layout.HEADER_HEIGHT}px);
  background-color: ${(p) => p.theme.colors.general.white};
  flex: 0 0 ${Layout.SIDEBAR_MOBILE_WIDTH}px;
  border-right: 1px solid ${(p) => p.theme.colors.border.main};

  @media (min-width: ${(p) => p.theme.screen.md}) {
    padding-top: ${(p) => p.theme.spacing.sm};
    position: sticky;
    margin-right: ${(p) => p.theme.spacing.md};
    z-index: ${(p) => p.theme.zIndex.sm};
    background-color: transparent;
    border: 0;
  }

  @media (max-width: ${(p) => p.theme.screen.md}) {
    display: ${(p) => (p.isOpen ? 'block' : 'none')};
  }
`;

export const UL = styled.ul`
  list-style-type: none;
  padding: 0;
`;

interface LiProps {
  hideOnDesktop?: boolean;
  noHover?: boolean;
}

export const LI = styled.li<LiProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-right: ${(p) => p.theme.spacing.xs};
  border-radius: ${(p) => p.theme.spacing.xs};

  ${(p) =>
    !p.noHover &&
    `
    &:hover {
      background-color: ${p.theme.colors.grey[10]};
    }
  `};

  @media (min-width: ${(p) => p.theme.screen.lg}) {
    ${(p) => p.hideOnDesktop && 'display: none'}
  }
`;
