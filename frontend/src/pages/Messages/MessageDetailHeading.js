import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import usersData from './users.json';

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 60px;
  border-bottom: 1px solid ${p => p.theme.colors.grey[300]};
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

const Image = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
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
  justify-content: flex-start;
  padding: 0 ${p => p.theme.spacing.sm};
  color: ${p => p.theme.colors.text.secondary};
  font-size: ${p => p.theme.font.size.xs};
`;

const To = styled.div`
  margin-top: 1px;
`;

const Input = styled.input`
  width: 100%;
  outline: none;
  margin-left: ${p => p.theme.spacing.xs};
  font-size: ${p => p.theme.font.size.xs};
  color: ${p => p.theme.colors.text.secondary};
  border: 0;
  flex: 1;
`;

const MessageDetailHeading = ({ match }) => {
  if (match.params.username === 'new') {
    return (
      <Header>
        <InputContainer>
          <To>To:</To>
          <Input
            type="text"
            placeholder="Type the name of a person"
            autoFocus
          />
        </InputContainer>
      </Header>
    );
  }

  return (
    <Header>
      <User
        key={usersData[0].username}
        activeClassName="selected"
        to={`/messages/${usersData[0].username}`}
      >
        <Image src={usersData[0].image} alt={usersData[0].fullName} />
        <UserInfo>
          <UserFullName>{usersData[0].fullName}</UserFullName>
        </UserInfo>
      </User>
    </Header>
  );
};

MessageDetailHeading.propTypes = {
  match: PropTypes.object.isRequired,
};

export default MessageDetailHeading;
