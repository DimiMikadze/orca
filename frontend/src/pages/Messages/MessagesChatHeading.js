import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Search from 'components/Search';
import Avatar from 'components/Avatar';

import * as Routes from 'routes';

const Root = styled.div`
  position: relative;
  background-color: ${p => p.theme.colors.white};
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 60px;
  border-bottom: 1px solid ${p => p.theme.colors.grey[300]};
  z-index: 1;
`;

const User = styled.div`
  margin: 0 ${p => p.theme.spacing.xxs};
  padding: ${p => p.theme.spacing.xxs} ${p => p.theme.spacing.xxs};
  border-radius: ${p => p.theme.radius.md};
  display: flex;
  flex-direction: row;
  align-items: center;
  text-decoration: none;
`;

const UserInfo = styled.div`
  padding-left: ${p => p.theme.spacing.xs};
`;

const UserFullName = styled.div`
  font-size: ${p => p.theme.font.size.sm};
  color: ${p => p.theme.colors.text.primary};
  font-weight: ${p => p.theme.font.weight.bold};
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

/**
 * Heading component for messages chat
 */
const MessagesChatHeading = ({ location, match, chatUser }) => {
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
          key={chatUser.username}
          activeClassName="selected"
          to={`/messages/${chatUser.username}`}
        >
          <Avatar image={chatUser.image} size={40} />

          <UserInfo>
            <UserFullName>{chatUser.fullName}</UserFullName>
          </UserInfo>
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
