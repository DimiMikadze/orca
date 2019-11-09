import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Notification from '../Notification';

const Root = styled.div`
  position: absolute;
  width: 100%;
  max-height: 350px;
  overflow-y: auto;
  background-color: white;
  right: 0;
  top: 60px;
  z-index: ${p => p.theme.zIndex.xl};
  box-shadow: ${p => p.theme.shadows.sm};

  @media (min-width: ${p => p.theme.screen.sm}) {
    width: 500px;
    right: ${p => p.theme.spacing.lg};
  }
`;

const Empty = styled.div`
  padding: ${p => p.theme.spacing.xs};
`;

/**
 * Component that renders Header Notification's dropdown
 */
const HeaderNotificationDropDown = ({
  notificationRef,
  dropdownData,
  closeDropDown,
}) => {
  return (
    <Root ref={notificationRef}>
      {!dropdownData.length ? (
        <Empty>No new notifications.</Empty>
      ) : (
        dropdownData.map(notification => (
          <Notification
            key={notification.id}
            notification={notification}
            close={closeDropDown}
          />
        ))
      )}
    </Root>
  );
};

HeaderNotificationDropDown.propTypes = {
  notificationRef: PropTypes.object,
  dropdownData: PropTypes.array,
  closeDropDown: PropTypes.func,
};

export default HeaderNotificationDropDown;
