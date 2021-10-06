import { useState, forwardRef, ForwardRefRenderFunction, useRef, RefObject, useEffect } from 'react';
import Router from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import { updateNotificationSeen } from '../../pages/notifications';
import {
  Root,
  Wrapper,
  Hamburger,
  Container,
  SearchContainer,
  NotificationsAndAvatar,
  NotificationsCount,
  Logo,
} from './style';

import { MenuIcon, NotificationIcon } from '../ui/icons';
import { Link, Button, Avatar, Spacing } from '../ui';
import { openAuthPopup, cleanUserNotifications, PopupType } from '../../store/auth';
import HeaderUser from './HeaderUser';
import HeaderNotifications from './HeaderNotifications';
import Search from '../Search';
import { RootState } from '../../store';
import { useBreakpoints } from '../../utils';

interface HeaderProps {
  toggleSidebar?: () => void;
  ref: RefObject<HTMLButtonElement>;
}

const Header: ForwardRefRenderFunction<HTMLButtonElement, HeaderProps> = ({ toggleSidebar }, ref) => {
  const breakpoint = useBreakpoints();
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const logo = useSelector((state: RootState) => state.settings.communityLogo);
  const { mutateAsync: updateSeen } = useMutation(updateNotificationSeen);
  const router = useRouter();
  const authUserRef = useRef(null);
  const notificationsRef = useRef(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsDropdownOpen, setIsNotificationsDropdownOpen] = useState(false);

  useEffect(() => {
    Router.events.on('routeChangeComplete', () => {
      if (isUserDropdownOpen) {
        setIsUserDropdownOpen(false);
      }

      if (isNotificationsDropdownOpen) {
        setIsNotificationsDropdownOpen(false);
      }
    });
  }, [isUserDropdownOpen, isNotificationsDropdownOpen]);

  const closeDropDown = () => {
    setIsUserDropdownOpen(false);
    setIsNotificationsDropdownOpen(false);

    if (isNotificationsDropdownOpen && authUser && authUser.notifications.length > 0) {
      dispatch(cleanUserNotifications());
      updateSeen();
    }
  };

  const onNotificationIconClick = () => {
    if (!isNotificationsDropdownOpen) {
      setIsNotificationsDropdownOpen(true);
    } else {
      closeDropDown();
    }
  };

  const isSmallScreen = breakpoint === 'xs' || breakpoint === 'sm';

  return (
    <Root>
      <Wrapper>
        <Container>
          <Hamburger ref={ref} onClick={toggleSidebar}>
            <MenuIcon />
          </Hamburger>
          <Logo>
            <Link href="/" disableBorderOnHover>
              <img alt="logo" style={{ height: 30 }} src={logo} />
            </Link>
          </Logo>
          <Spacing left="sm" />
          <SearchContainer>
            <Search
              hideBorder
              backgroundColor={5}
              placeholder="Search for posts and members"
              onItemClick={(item) =>
                item.fullName ? router.push(`/profile/${item._id}`) : router.push(`/post/${item._id}`)
              }
            />
          </SearchContainer>
        </Container>

        <Spacing right="sm" />

        <NotificationsAndAvatar>
          {authUser && (
            <div ref={notificationsRef}>
              <Spacing right="sm">
                <Button ghost onClick={onNotificationIconClick}>
                  {authUser?.notifications.length > 0 && (
                    <NotificationsCount>{authUser?.notifications.length}</NotificationsCount>
                  )}
                  <NotificationIcon />
                </Button>
              </Spacing>

              {isNotificationsDropdownOpen && (
                <HeaderNotifications
                  isNotificationsDropdownOpen={isNotificationsDropdownOpen}
                  notificationsRef={notificationsRef}
                  closeDropDown={closeDropDown}
                />
              )}
            </div>
          )}

          <div ref={authUserRef}>
            {authUser ? (
              <Button ghost onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
                <Avatar image={authUser.image} />
              </Button>
            ) : (
              <Button
                ghost={isSmallScreen}
                size="sm"
                color="primary"
                onClick={() => dispatch(openAuthPopup(PopupType.Log_In))}
              >
                {isSmallScreen ? <Avatar /> : 'Log in'}
              </Button>
            )}
            {isUserDropdownOpen && (
              <HeaderUser
                isUserDropdownOpen={isUserDropdownOpen}
                authUserRef={authUserRef}
                closeDropDown={closeDropDown}
              />
            )}
          </div>
        </NotificationsAndAvatar>
      </Wrapper>
    </Root>
  );
};

export default forwardRef(Header);
