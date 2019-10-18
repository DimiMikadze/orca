import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';

import { Button, Textarea } from 'components/Form';
import { CloseIcon, SendIcon } from 'components/icons';

import { CREATE_MESSAGE, DELETE_MESSAGE } from 'graphql/messages';

const Root = styled.div`
  padding: 0 ${p => p.theme.spacing.sm};
  overflow-y: auto;
  height: 100vh;
  margin-top: -120px;
  padding-top: 120px;
  display: flex;
  flex-direction: column;

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${p => p.theme.colors.grey[500]};
    border-radius: ${p => p.theme.radius.lg};
    visibility: hidden;

    &:hover {
      background-color: ${p => p.theme.colors.grey[600]};
    }
  }

  &:hover {
    ::-webkit-scrollbar-thumb {
      visibility: visible;
    }
  }
`;

const Conversation = styled.div`
  flex: 1;
`;

const DeleteIconButton = styled(Button)`
  right: -${p => p.theme.spacing.sm};
  left: -${p => p.userMessage && p.theme.spacing.sm};
  position: absolute;
  align-self: center;
  display: none;
`;

const MessageDate = styled.span`
  position: absolute;
  bottom: -${p => p.theme.spacing.sm};
  left: ${p => !p.userMessage && p.theme.spacing.lg};
  right: -${p => p.userMessage && 0};
  display: none;
  font-size: ${p => p.theme.font.size.xxs};
`;

const MessageWrapper = styled.div`
  display: flex;
  position: relative;
  justify-content: ${p => p.userMessage && 'flex-end'};
  margin: ${p => p.theme.spacing.md} 0;

  &:hover ${DeleteIconButton} {
    display: block;
  }

  &:hover ${MessageDate} {
    display: block;
  }
`;

const Image = styled.img`
  width: 28px;
  height: 28px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: ${p => p.theme.spacing.xs};
`;

const Message = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  max-width: 300px;
  line-height: 21px;
  font-size: ${p => p.theme.font.size.xs};
  padding: ${p => p.theme.spacing.xxs} ${p => p.theme.spacing.xs};
  border-radius: ${p => p.theme.radius.lg};
  color: ${p => p.userMessage && p.theme.colors.white};
  background-color: ${p =>
    p.userMessage ? p.theme.colors.primary.light : p.theme.colors.grey[200]};
`;

const Form = styled.form`
  background-color: ${p => p.theme.colors.white};
  position: sticky;
  bottom: 0;
  width: 100%;
  display: flex;
  padding: ${p => p.theme.spacing.xxs};
  padding-left: ${p => p.theme.spacing.sm};
  padding-right: ${p => p.theme.spacing.md};
`;

const StyledTextarea = styled(Textarea)`
  height: 38px;
  border-radius: ${p => p.theme.radius.lg};
  background-color: ${p => p.theme.colors.grey[200]};
`;

const SendIconButton = styled(Button)`
  margin-left: ${p => p.theme.spacing.sm};
  align-self: center;
`;

const MessageConversation = ({ messages, authUser, chatUser }) => {
  const [messageText, setMessageText] = useState('');
  const [createMessage] = useMutation(CREATE_MESSAGE);
  const [deleteMessage] = useMutation(DELETE_MESSAGE);

  const sendMessage = e => {
    e.preventDefault();

    setMessageText('');
    createMessage({
      variables: {
        input: {
          sender: authUser.id,
          receiver: chatUser.id,
          message: messageText,
        },
      },
    });
  };

  const onEnterPress = e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      sendMessage(e);
    }
  };

  const removeMessage = id => {
    deleteMessage({
      variables: {
        input: {
          id,
        },
      },
    });
  };

  return (
    <Root>
      <Conversation>
        {messages.map(message => {
          const isAuthUserReceiver = authUser.id === message.sender.id;

          return (
            <MessageWrapper userMessage={isAuthUserReceiver} key={message.id}>
              {!isAuthUserReceiver && (
                <Image
                  src={message.sender.image}
                  alt={message.sender.fullName}
                />
              )}

              <Message userMessage={isAuthUserReceiver}>
                {message.message}

                <DeleteIconButton
                  ghost
                  userMessage={isAuthUserReceiver}
                  onClick={() => removeMessage(message.id)}
                >
                  <CloseIcon width="10" />
                </DeleteIconButton>
              </Message>

              <MessageDate userMessage={isAuthUserReceiver}>
                {message.createdAt}
              </MessageDate>
            </MessageWrapper>
          );
        })}
      </Conversation>

      <Form onSubmit={sendMessage}>
        <StyledTextarea
          placeholder="Type a message"
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          onKeyDown={onEnterPress}
        />

        <SendIconButton type="submit" ghost>
          <SendIcon width="28" />
        </SendIconButton>
      </Form>
    </Root>
  );
};

MessageConversation.propTypes = {
  messages: PropTypes.array.isRequired,
  authUser: PropTypes.object.isRequired,
  chatUser: PropTypes.object,
};

export default MessageConversation;
