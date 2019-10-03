import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { generatePath, withRouter } from 'react-router-dom';

import { NotificationIcon, MenuIcon } from 'components/icons';
import { Container, Spacing } from 'components/Layout';
import { A } from 'components/Text';
import { Button } from 'components/Form';
import { UserIcon } from 'components/icons';
import SignOut from './SignOut';
import Notification from './Notification';
import Search from './Search';

import { useClickOutside } from 'hooks/useClickOutside';

import { useStore } from 'store';

import { HEADER_HEIGHT } from 'constants/Layout';
import SiteInfo from 'constants/SiteInfo.json';

import * as Routes from 'routes';

const Root = styled(Container)`
  position: sticky;
  top: 0;
  background-color: ${p => p.theme.colors.white};
  z-index: ${p => p.theme.zIndex.md};
  height: ${HEADER_HEIGHT}px;
  box-shadow: ${p => p.theme.shadows.md};

  @media (min-width: ${p => p.theme.screen.md}) {
    z-index: ${p => p.theme.zIndex.md};
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: ${HEADER_HEIGHT}px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: ${p => p.theme.screen.md}) {
    width: ${p => p.theme.screen.md};
  }

  @media (min-width: ${p => p.theme.screen.lg}) {
    width: ${p => p.theme.screen.lg};
  }
`;

const LeftSide = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Hamburger = styled.div`
  cursor: pointer;

  @media (min-width: ${p => p.theme.screen.md}) {
    display: none;
  }
`;

const Logo = styled(A)`
  display: none;
  color: ${p => p.theme.colors.primary.main};
  font-weight: ${p => p.theme.font.weight.bold};
  font-size: ${p => p.theme.font.size.sm};

  &:hover {
    color: ${p => p.theme.colors.primary.main};
  }

  @media (min-width: ${p => p.theme.screen.md}) {
    display: block;
  }
`;

const RightSide = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
`;

const NotificationCount = styled.span`
  top: -6px;
  left: 10px;
  position: absolute;
  height: 22px;
  width: 22px;
  padding: 2px;
  letter-spacing: -1px;
  border-radius: 50%;
  color: ${p => p.theme.colors.white};
  background-color: ${p => p.theme.colors.error.main};
  font-size: ${p => p.theme.font.size.xxs};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const NotificationWrapper = styled.div`
  position: absolute;
  width: 100%;
  max-height: 350px;
  overflow-y: auto;
  background-color: white;
  right: 0;
  top: 60px;
  z-index: ${p => p.theme.zIndex.xl};
  box-shadow: ${p => p.theme.shadows.xl};

  @media (min-width: ${p => p.theme.screen.sm}) {
    width: 500px;
    right: ${p => p.theme.spacing.lg};
  }
`;

const NoNotification = styled.div`
  padding: ${p => p.theme.spacing.xs};
`;

const ImageContainer = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DropDown = styled.div`
  text-align: center;
  position: absolute;
  background-color: white;
  line-height: ${p => p.theme.spacing.md};
  right: 0;
  top: 60px;
  z-index: ${p => p.theme.zIndex.xl};
  box-shadow: ${p => p.theme.shadows.xl};
`;

const DropDownStyle = css`
  transition: background-color 0.1s;
  display: block;
  padding: ${p => p.theme.spacing.sm} ${p => p.theme.spacing.xl};

  &:hover {
    background-color: ${p => p.theme.colors.grey[100]};
  }
`;

const DropDownLink = styled(A)`
  ${DropDownStyle};
`;

const DropDownItem = styled.div`
  ${DropDownStyle};
`;

/**
 * Header of the App when user is authenticated
 */
const Header = ({ location, toggleSideBar }) => {
  const [{ auth }] = useStore();
  const [isUserDropDownOpen, setIsUserDopDownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [newNotifications, setNewNotifications] = useState([]);

  const notificationRef = useRef(null);
  const dropDownRef = useRef(null);

  useClickOutside(notificationRef, () => handleNotificationIconClick());
  useClickOutside(dropDownRef, () => handleUserIconClick());

  useEffect(() => {
    return () => {
      setIsUserDopDownOpen(false);
      setIsNotificationOpen(false);
    };
  }, [location.pathname]);

  const handleUserIconClick = () => {
    if (isUserDropDownOpen) {
      setIsUserDopDownOpen(false);
    } else {
      setIsUserDopDownOpen(true);
      setIsNotificationOpen(false);
    }
  };

  const NewNotificationsData = auth.user.newNotifications;

  const handleNotificationIconClick = () => {
    if (isNotificationOpen) {
      setIsNotificationOpen(false);
      setNewNotifications([]);
    } else {
      setNewNotifications(NewNotificationsData);
      setIsNotificationOpen(true);
      setIsUserDopDownOpen(false);
    }
  };

  return (
    <Root>
      <Wrapper>
        <LeftSide>
          <Hamburger onClick={toggleSideBar}>
            <MenuIcon />
          </Hamburger>

          <Logo to={Routes.HOME}>{SiteInfo.name}</Logo>

          <Spacing left="sm" right="md">
            <Search location={location} />
          </Spacing>
        </LeftSide>

        <RightSide>
          <Spacing right="md">
            <Button ghost onClick={handleNotificationIconClick}>
              {NewNotificationsData.length > 0 && (
                <NotificationCount>
                  {NewNotificationsData.length}
                </NotificationCount>
              )}
              <NotificationIcon />
            </Button>
          </Spacing>

          <Button ghost onClick={handleUserIconClick}>
            <ImageContainer>
              {auth.user.image ? (
                <Image src={auth.user.image} />
              ) : (
                <UserIcon width={28} />
              )}
            </ImageContainer>
          </Button>
        </RightSide>

        {isNotificationOpen && (
          <NotificationWrapper>
            {!newNotifications.length ? (
              <NoNotification ref={notificationRef}>
                No new notifications
              </NoNotification>
            ) : (
              newNotifications.map(notification => (
                <Notification
                  key={notification.id}
                  notification={notification}
                  close={() => setIsNotificationOpen(false)}
                />
              ))
            )}
          </NotificationWrapper>
        )}

        {isUserDropDownOpen && (
          <DropDown ref={dropDownRef}>
            <DropDownLink
              to={generatePath(Routes.USER_PROFILE, {
                username: auth.user.username,
              })}
            >
              My Profile
            </DropDownLink>

            <DropDownItem>
              <SignOut />
            </DropDownItem>
          </DropDown>
        )}
      </Wrapper>
    </Root>
  );
};

Header.propTypes = {
  location: PropTypes.object.isRequired,
  toggleSideBar: PropTypes.func.isRequired,
};

export default withRouter(Header);
