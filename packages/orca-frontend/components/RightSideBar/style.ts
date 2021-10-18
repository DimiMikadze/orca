import styled from 'styled-components';
import { Layout } from '../../constants';

export const Root = styled.div`
  display: none;
  position: sticky;
  top: ${Layout.HEADER_HEIGHT}px;
  right: 0;
  height: calc(100vh - ${Layout.HEADER_HEIGHT}px);
  padding-top: ${(p) => p.theme.spacing.md};
  margin-left: ${(p) => p.theme.spacing.md};
  padding-right: ${(p) => p.theme.spacing.sm};
  overflow: hidden;
  overflow-y: auto;

  @media (min-width: ${(p) => p.theme.screen.lg}) {
    flex: 0 0 ${Layout.SIDEBAR_MOBILE_WIDTH}px;
    display: block;
  }

  @media (min-width: ${(p) => p.theme.screen.xl}) {
    flex: 0 0 ${Layout.SIDEBAR_DESKTOP_WIDTH}px;
  }
`;

export const Heading = styled.div`
  border-bottom: 1px solid ${(p) => p.theme.colors.border.main};
  padding-bottom: ${(p) => p.theme.spacing.xs};
`;

export const PersonContainer = styled.div`
  border-radius: ${(p) => p.theme.spacing.xs};
  padding-left: ${(p) => p.theme.spacing.xxs};

  &:hover {
    background-color: ${(p) => p.theme.colors.grey[10]};
  }
`;

export const Person = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: ${(p) => p.theme.spacing.xs} 0;
`;
