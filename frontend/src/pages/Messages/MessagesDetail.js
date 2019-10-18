import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';

import { LoadingDots } from 'components/Loading';
import MessageConversation from './MessageConversation';
import MessagesDetailHeading from './MessageDetailHeading';

import { GET_MESSAGES } from 'graphql/messages';

const Root = styled.div`
  width: 100%;
  height: 100%;
`;

const MessagesDetail = ({ match, authUser }) => {
  const { data, loading } = useQuery(GET_MESSAGES, {
    variables: { authUserId: authUser.id, userId: match.params.userId },
    skip: match.params.userId === 'new',
  });

  if (loading) {
    return (
      <Root>
        <LoadingDots />
      </Root>
    );
  }

  let chatUser;
  if (data && data.getMessages.length > 0) {
    const user = data.getMessages[0];
    chatUser = user.receiver.id === authUser.id ? user.sender : user.receiver;
  }

  return (
    <Root>
      <MessagesDetailHeading match={match} chatUser={chatUser} />

      <MessageConversation
        authUser={authUser}
        messages={data ? data.getMessages : []}
        chatUser={chatUser}
      />
    </Root>
  );
};

MessagesDetail.propTypes = {
  match: PropTypes.object.isRequired,
  authUser: PropTypes.object.isRequired,
};

export default MessagesDetail;
