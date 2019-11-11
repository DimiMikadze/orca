import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';
import { withApollo } from 'react-apollo';

import { A } from 'components/Text';
import { Spacing } from 'components/Layout';
import Avatar from 'components/Avatar';

import { useClickOutside } from 'hooks/useClickOutside';

import { GET_AUTH_USER } from 'graphql/user';
import { UPDATE_NOTIFICATION_SEEN } from 'graphql/notification';

import { useStore } from 'store';

import * as Routes from 'routes';

const NotificationItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${p => p.theme.spacing.xs};
  border-bottom: 1px solid ${p => p.theme.colors.border.main};
  font-size: ${p => p.theme.font.size.xxs};
  background-color: ${p => p.theme.colors.white};

  &:last-child {
    border-bottom: 0;
  }
`;

const LeftSide = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Name = styled.div`
  font-weight: ${p => p.theme.font.weight.bold};
`;

const Action = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  margin-left: ${p => p.theme.spacing.xs};
`;

const PostImage = styled.div`
  width: 40px;
  height: 40px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

/**
 * Renders user notifications
 */
const Notification = ({ notification, close, client }) => {
  const [{ auth }] = useStore();

  const ref = React.useRef(null);

  useClickOutside(ref, close);

  useEffect(() => {
    const updateNotificationSeen = async () => {
      try {
        await client.mutate({
          mutation: UPDATE_NOTIFICATION_SEEN,
          variables: {
            input: {
              userId: auth.user.id,
            },
          },
          refetchQueries: () => [{ query: GET_AUTH_USER }],
        });
      } catch (err) {}
    };

    updateNotificationSeen();
  }, [auth.user.id, auth.user.newNotifications.length, client]);

  if (!notification.follow && !notification.like && !notification.comment) {
    return null;
  }

  return (
    <NotificationItem ref={ref}>
      <A
        to={generatePath(Routes.USER_PROFILE, {
          username: notification.author.username,
        })}
      >
        <LeftSide>
          <Avatar image={notification.author.image} size={34} />

          <Spacing left="xs" />

          <Name>{notification.author.fullName}</Name>
        </LeftSide>
      </A>

      {notification.follow && <Action>started following you</Action>}

      {notification.like && (
        <Action>
          likes your photo
          <A to={generatePath(Routes.POST, { id: notification.like.post.id })}>
            <PostImage>
              <Image src={notification.like.post.image} />
            </PostImage>
          </A>
        </Action>
      )}

      {notification.comment && (
        <Action>
          commented on your photo
          <A
            to={generatePath(Routes.POST, { id: notification.comment.post.id })}
          >
            <PostImage>
              <Image src={notification.comment.post.image} />
            </PostImage>
          </A>
        </Action>
      )}
    </NotificationItem>
  );
};

Notification.propTypes = {
  client: PropTypes.object.isRequired,
  close: PropTypes.func,
};

export default withApollo(Notification);
