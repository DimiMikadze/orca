import React, { FC, KeyboardEvent, useEffect, useState, useRef, FormEvent } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  Root,
  Header,
  Container,
  FullName,
  MessageWrapper,
  MessagesConversation,
  Conversation,
  Form,
  Message,
  MessageDate,
  Textarea,
  ScrollWrapper,
} from './style';
import { Avatar, Link, Spacing, Button } from '../../ui';
import Search from '../../Search';
import { PlusIcon } from '../../ui/icons';
import { RootState } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket, date, useNotifications } from '../../../utils';
import { Events } from '../../../constants';
import { addToMessagesList } from '../cache';
import { NotificationType } from '../../../constants/Notification';
import { removeUserNotification } from '../../../store/auth';
import Linkify from '../../Linkify';
import { useRouter } from 'next/router';

interface MessagesChatProps {
  onSearchItemClick: (user: any) => void;
  userId?: string;
  user: any;
}

const fetchMessages = async ({ queryKey }) => {
  const [, userId] = queryKey;
  const { data } = await axios.get(`/messages?userId=${userId}`);
  return data;
};

const createMessage = async ({ message, receiver }) => {
  const newMessage = await axios.post('/messages/create', { message, receiver });
  return newMessage;
};

const updateMessagesSeen = async (userId) => {
  const { data } = await axios.put('/notifications/messages-seen', { userId });
  return data;
};

const MessagesChat: FC<MessagesChatProps> = ({ onSearchItemClick, userId, user }) => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const scrollToBottomRef = useRef(null);
  const authUser = useSelector((state: RootState) => state.auth.user);
  const queryClient = useQueryClient();
  const { data: messages } = useQuery(['messages', userId], fetchMessages, {
    enabled: userId !== undefined,
  });
  const { mutateAsync: sendMessage } = useMutation(createMessage);
  const { mutateAsync: updateMessagesSeenMutation } = useMutation(updateMessagesSeen);
  const socket = useSocket();
  const dispatch = useDispatch();
  const { createNotification } = useNotifications();

  useEffect(() => {
    if (!socket) {
      return;
    }

    const sendMessageListener = (data: any) => {
      if (data.sender._id === userId && data.receiver._id === authUser._id) {
        addToMessagesList(queryClient, data, userId);
      }
    };

    socket.on(Events.SEND_MESSAGE, sendMessageListener);

    if (scrollToBottomRef.current) {
      scrollToBottomRef.current.scrollIntoView();
    }

    return () => {
      socket.off(Events.SEND_MESSAGE, sendMessageListener);
    };
  }, [socket, queryClient, messages, authUser, userId]);

  useEffect(() => {
    if (authUser.notifications.length < 1) {
      return;
    }

    const notification = authUser.notifications.find((n) => {
      if (n?.author?._id === userId && n?.user === authUser._id && n.message) {
        return n;
      }
    });

    const clearMessageNotifications = async () => {
      dispatch(removeUserNotification(notification._id));
      await updateMessagesSeenMutation(userId);
    };

    if (notification) {
      clearMessageNotifications();
    }
  }, [updateMessagesSeenMutation, userId, authUser, dispatch]);

  const onSubmit = async (e: FormEvent<HTMLFormElement> | KeyboardEvent<Element>) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    try {
      const newMessageResponse = await sendMessage({ message, receiver: user._id });
      const newMessage = {
        _id: newMessageResponse.data._id,
        message,
        seen: false,
        createdAt: newMessageResponse.data.createdAt,
        sender: authUser,
        receiver: user,
      };
      addToMessagesList(queryClient, newMessage, userId);
      socket.emit(Events.CREATE_MESSAGE, newMessage);
      setMessage('');
      const notificationExists = await axios.get(`/notifications/author-and-user/${user._id}`);
      if (!notificationExists.data) {
        createNotification({
          user: user,
          postId: null,
          notificationType: NotificationType.MESSAGE,
          notificationTypeId: newMessageResponse?.data?._id,
          queryKey: ['messages', userId],
          disableCacheUpdate: true,
        });
      }
    } catch (error) {
      console.error('An error occurred while sending a message: ', error);
    }
  };

  const onEnterPress = (e: KeyboardEvent<Element>) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      onSubmit(e);
    }
  };

  return (
    <Root>
      <Header>
        {user ? (
          <Container>
            <Link href={`/profile/${user._id}`} disableBorderOnHover>
              <Avatar isOnline={user.isOnline} image={user.image} size={1.5} />
              <FullName>{user.fullName}</FullName>
            </Link>
          </Container>
        ) : (
          <Container>
            To:
            <Spacing left="xs">
              <Search
                onlyUsers
                onItemClick={(user: any) => onSearchItemClick(user)}
                hideBorder
                hideIcon
                placeholder="Name of a member"
              />
            </Spacing>
          </Container>
        )}
      </Header>
      <ScrollWrapper>
        <MessagesConversation>
          <Conversation>
            {messages &&
              messages.map((m) => {
                const isSender = m.sender._id === authUser._id;
                return (
                  <MessageWrapper isSender={isSender} key={m._id}>
                    {!isSender && (
                      <Spacing right="xxs">
                        <Avatar image={m.sender.image} />
                      </Spacing>
                    )}

                    <Message isSender={isSender}>
                      <Linkify>{m.message}</Linkify>
                    </Message>

                    <MessageDate isSender={isSender}>{date(m.createdAt)}</MessageDate>
                  </MessageWrapper>
                );
              })}

            <div ref={scrollToBottomRef} />
          </Conversation>
        </MessagesConversation>

        {router.pathname !== '/messages' && (
          <Form onSubmit={onSubmit}>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={onEnterPress} />
            <Spacing left="sm" top="xxs">
              <Button type="submit" ghost>
                <PlusIcon width="28" />
              </Button>
            </Spacing>
          </Form>
        )}
      </ScrollWrapper>
    </Root>
  );
};

export default MessagesChat;
