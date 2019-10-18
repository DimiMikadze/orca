import React from 'react';
import styled from 'styled-components';

import { Button, Textarea } from 'components/Form';
import { CloseIcon, SendIcon } from 'components/icons';
import chatData from './chat.json';

const Root = styled.div`
  padding: 0 ${p => p.theme.spacing.sm};
  overflow-y: auto;
  height: 100vh;
  margin-top: -120px;
  padding-top: 120px;

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

const TextareaContainer = styled.div`
  background-color: ${p => p.theme.colors.white};
  position: sticky;
  bottom: 0;
  width: 100%;
  display: flex;
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

const MessageConversation = () => {
  return (
    <Root>
      <div>
        {chatData.map(chat => (
          <MessageWrapper userMessage={chat.id === 2}>
            {chat.id !== 2 && <Image src={chat.image} alt={chat.fullName} />}
            <Message userMessage={chat.id === 2}>
              {chat.message}

              <DeleteIconButton ghost userMessage={chat.id === 2}>
                <CloseIcon width="10" />
              </DeleteIconButton>
            </Message>

            <MessageDate userMessage={chat.id === 2}>
              {chat.createdAt}
            </MessageDate>
          </MessageWrapper>
        ))}
      </div>

      <TextareaContainer>
        <StyledTextarea />

        <SendIconButton ghost>
          <SendIcon width="28" />
        </SendIconButton>
      </TextareaContainer>
    </Root>
  );
};

export default MessageConversation;
