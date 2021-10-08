import styled from 'styled-components';
import { Layout } from '../../constants';
import { Button } from '../ui';

export const Root = styled.div`
  position: sticky;
  top: 0;
  background-color: ${(p) => p.theme.colors.general.white};
  height: ${Layout.HEADER_HEIGHT}px;
  z-index: ${(p) => p.theme.zIndex.md};
  box-shadow: 0 2px 1px -1px ${(p) => p.theme.colors.grey[30]};
`;

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: ${Layout.HEADER_HEIGHT}px;
  margin: 0 auto;
  padding: 0 ${(p) => p.theme.spacing.sm};
  width: 100%;

  /* @media (min-width: ${(p) => parseInt(p.theme.screen.lg, 10) + 20 + 'px'}) {
    max-width: ${(p) => p.theme.screen.lg};
  }

  @media (min-width: ${(p) => parseInt(p.theme.screen.xl, 10) + 20 + 'px'}) {
    max-width: ${(p) => p.theme.screen.xl};
  } */
`;

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 380px;
`;

export const SearchContainer = styled.div`
  width: 100%;
`;

export const NotificationsAndAvatar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

export const NotificationsCount = styled.div`
  flex-shrink: 0;
  top: -2px;
  right: -34px;
  width: 12px;
  height: 12px;
  display: flex;
  cursor: pointer;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${(p) => p.theme.spacing.xs};
  font-size: ${(p) => p.theme.font.size.xxs};
  font-weight: ${(p) => p.theme.font.weight.bold};
  border-radius: ${(p) => p.theme.radius.lg};
  color: ${(p) => p.theme.colors.general.white};
  background-color: ${(p) => p.theme.colors.general.secondary};
`;

export const NotificationDropDown = styled.div`
  position: absolute;
  width: 100%;
  max-height: 350px;
  overflow-y: auto;
  background-color: ${(p) => p.theme.colors.general.white};
  right: 0;
  top: 54px;
  z-index: ${(p) => p.theme.zIndex.xl};
  box-shadow: ${(p) => p.theme.shadows.md};
  border-radius: ${(p) => p.theme.radius.sm};

  @media (min-width: ${(p) => p.theme.screen.sm}) {
    width: 500px;
    right: ${(p) => p.theme.spacing.lg};
  }
`;

export const Hamburger = styled.button`
  cursor: pointer;
  border: 0;
  background-color: transparent;
  padding: 0;

  @media (min-width: ${(p) => p.theme.screen.lg}) {
    display: none;
  }
`;

export const Logo = styled.div`
  @media (max-width: ${(p) => p.theme.screen.lg}) {
    display: none;
  }
`;

export const UserDropDown = styled.div`
  text-align: center;
  position: absolute;
  background-color: ${(p) => p.theme.colors.general.white};
  line-height: ${(p) => p.theme.spacing.md};
  right: ${(p) => p.theme.spacing.sm};
  top: 54px;
  z-index: ${(p) => p.theme.zIndex.md};
  box-shadow: ${(p) => p.theme.shadows.md};
  border-radius: ${(p) => p.theme.radius.sm};
`;

export const UserDropDownItem = styled(Button)`
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.xl};
`;

export const AllNotifications = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.border.main};
  padding: ${(p) => p.theme.spacing.xs};
`;
