import styled from 'styled-components';
import { Layout } from '../../constants';
import { Button } from '../ui';

interface RootProps {
  isOpen: boolean;
}

export const Root = styled.div<RootProps>`
  position: fixed;
  top: ${Layout.HEADER_HEIGHT}px;
  left: 0;
  padding-top: ${(p) => p.theme.spacing.sm};
  width: ${Layout.SIDEBAR_DESKTOP_WIDTH}px;
  flex: 0 0 ${Layout.SIDEBAR_DESKTOP_WIDTH}px;
  font-size: ${(p) => p.theme.font.size.xxs};
  z-index: ${(p) => p.theme.zIndex.xs};
  height: calc(100vh - ${Layout.HEADER_HEIGHT}px);
  background-color: ${(p) => p.theme.colors.general.white};
  border-right: 1px solid ${(p) => p.theme.colors.border.main};
  padding-left: ${(p) => p.theme.spacing.sm};
  padding-right: ${(p) => p.theme.spacing.sm};
  padding-bottom: ${(p) => p.theme.spacing.md};

  @media (min-width: ${(p) => p.theme.screen.md}) {
    padding-right: 0;
    padding-top: ${(p) => p.theme.spacing.sm};
    position: sticky;
    flex: 0 0 ${Layout.SIDEBAR_MOBILE_WIDTH}px;
    margin-right: ${(p) => p.theme.spacing.md};
    background-color: transparent;
    border: 0;
  }

  @media (max-width: ${(p) => p.theme.screen.md}) {
    display: ${(p) => (p.isOpen ? 'block' : 'none')};
  }

  @media (min-width: ${(p) => p.theme.screen.xl}) {
    flex: 0 0 ${Layout.SIDEBAR_DESKTOP_WIDTH}px;
  }
`;

export const UL = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const Popover = styled.div`
  position: relative;
`;

interface ThreeDotsProps {
  isOpen: boolean;
}

export const ThreeDots = styled.div<ThreeDotsProps>`
  ${(p) => !p.isOpen && 'opacity: 0;'};
`;

export const DragButton = styled(Button)`
  opacity: 0;
  cursor: grab;
`;

export const PopoverContent = styled.div`
  border-radius: ${(p) => p.theme.radius.sm};
  overflow: hidden;
  position: absolute;
  top: 30px;
  background-color: ${(p) => p.theme.colors.general.white};
  width: 160px;
  z-index: ${(p) => p.theme.zIndex.lg};
  box-shadow: ${(p) => p.theme.shadows.md};
`;

export const ChannelName = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface LIProps {
  noHover?: boolean;
}

export const LI = styled.li<LIProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-right: ${(p) => p.theme.spacing.xs};
  border-radius: ${(p) => p.theme.spacing.xs};

  &:hover {
    background-color: ${(p) => (p.noHover ? 'inherit' : p.theme.colors.grey[10])};
  }

  &:hover ${ThreeDots} {
    opacity: 1;
  }

  &:hover ${DragButton} {
    opacity: 1;
  }
`;
