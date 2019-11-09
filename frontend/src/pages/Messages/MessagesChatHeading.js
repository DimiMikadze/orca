import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { generatePath, withRouter, Link } from 'react-router-dom';
import { useSubscription } from '@apollo/react-hooks';

import Search from 'components/Search';
import Avatar from 'components/Avatar';

import { IS_USER_ONLINE_SUBSCRIPTION } from 'graphql/user';

import * as Routes from 'routes';

import { useStore } from 'store';

const Root = styled.div`
  position: relative;
  background-color: ${p => p.theme.colors.white};
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 60px;
  border-bottom: 1px solid ${p => p.theme.colors.border.main};
  z-index: 1;
`;

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 ${p => p.theme.spacing.sm};
  color: ${p => p.theme.colors.text.secondary};
  font-size: ${p => p.theme.font.size.xs};
`;

const To = styled.div`
  margin-top: 1px;
`;

const User = styled(Link)`
  margin: 0 ${p => p.theme.spacing.xxs};
  padding: ${p => p.theme.spacing.xxs} ${p => p.theme.spacing.xxs};
  border-radius: ${p => p.theme.radius.md};
  display: flex;
  flex-direction: row;
  align-items: center;
  text-decoration: none;
`;

const Info = styled.div`
  padding-left: ${p => p.theme.spacing.xs};
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const FullName = styled.div`
  font-size: ${p => p.theme.font.size.sm};
  color: ${p => p.theme.colors.text.primary};
  font-weight: ${p => p.theme.font.weight.bold};
`;

const Online = styled.div`
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: ${p => p.theme.colors.success};
  margin-left: ${p => p.theme.spacing.xs};
  border-radius: 50%;
`;

/**
 * Heading component for messages chat
 */
const MessagesChatHeading = ({ location, match, chatUser }) => {
  const [{ auth }] = useStore();

  const { data, loading } = useSubscription(IS_USER_ONLINE_SUBSCRIPTION, {
    variables: {
      authUserId: auth.user.id,
      userId: chatUser ? chatUser.id : null,
    },
    skip: !chatUser,
  });

  // Update user's isOnline field in real time
  if (!loading && data && chatUser) {
    chatUser.isOnline = data.isUserOnline.isOnline;
  }

  if (match.params.userId === Routes.NEW_ID_VALUE || !chatUser) {
    return (
      <Root>
        <InputContainer>
          <To>To:</To>
          <Search
            location={location}
            backgroundColor="white"
            hideIcon
            forMessage
            placeholder="Type the name of a person"
            autoFocus
          />
        </InputContainer>
      </Root>
    );
  }

  if (chatUser) {
    return (
      <Root>
        <User
          to={generatePath(Routes.USER_PROFILE, {
            username: chatUser.username,
          })}
        >
          <Avatar image={chatUser.image} size={40} />

          <Info>
            <FullName>{chatUser.fullName}</FullName>

            {chatUser.isOnline && <Online />}
          </Info>
        </User>
      </Root>
    );
  }

  return null;
};

MessagesChatHeading.propTypes = {
  match: PropTypes.object.isRequired,
  chatUser: PropTypes.object,
};

export default withRouter(MessagesChatHeading);
