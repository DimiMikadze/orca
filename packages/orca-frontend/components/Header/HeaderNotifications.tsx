import React, { FC, RefObject } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useClickOutside } from '../../utils';
import { NotificationDropDown, AllNotifications } from './style';
import { Spacing, Link } from '../ui';
import Notification from '../Notification';

interface HeaderNotificationsProps {
  closeDropDown: () => void;
  notificationsRef: RefObject<HTMLDivElement>;
  isNotificationsDropdownOpen: boolean;
}

const HeaderNotifications: FC<HeaderNotificationsProps> = ({
  closeDropDown,
  isNotificationsDropdownOpen,
  notificationsRef,
}) => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  useClickOutside(notificationsRef, isNotificationsDropdownOpen, () => {
    closeDropDown();
  });

  return (
    <NotificationDropDown>
      {!authUser?.notifications.length ? (
        <Spacing top="xs" right="xs" bottom="xs" left="xs">
          No new notifications.
        </Spacing>
      ) : (
        authUser.notifications.map((notification) => (
          <Notification key={notification._id} notification={notification} />
        ))
      )}
      <AllNotifications>
        <Link href="/notifications" size="sm">
          See all notifications
        </Link>
      </AllNotifications>
    </NotificationDropDown>
  );
};

export default HeaderNotifications;
