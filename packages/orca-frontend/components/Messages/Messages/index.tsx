import axios from 'axios';
import React, { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Root } from './style';
import MessagesUsers from '../MessagesUsers';
import MessagesChat from '../MessagesChat';
import { RootState } from '../../../store';
import { useSocket } from '../../../utils';
import { Events } from '../../../constants';
import { addNewUserToConversationsList, addOrUpdateUserInConversationsList, updateSeenInConversation } from '../cache';

interface MessagesProps {
  userId?: string;
}

const fetchConversations = async () => {
  const { data } = await axios.get('/messages/conversations');
  return data;
};

const fetchUser = async ({ queryKey }) => {
  const [, id] = queryKey;
  const { data } = await axios.get(`/users/${id}`);
  return data;
};

const updateMessageSeen = async ({ sender }) => {
  const messages = await axios.put('/messages/update-seen', { sender });
  return messages;
};

const Messages: FC<MessagesProps> = ({ userId }) => {
  const socket = useSocket();
  const router = useRouter();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const queryClient = useQueryClient();
  const { data: conversations, isFetching: isConversationFetching } = useQuery(['conversations'], fetchConversations);
  const { data: user } = useQuery(['userById', userId], fetchUser, {
    enabled: userId !== undefined,
  });
  const { mutateAsync: updateSeen } = useMutation(updateMessageSeen);

  useEffect(() => {
    if (!conversations || (conversations && conversations.length === 0) || !userId) {
      return;
    }

    const lastMessage = conversations.find((c: any) => c.sender._id === userId && c.receiver._id === authUser._id);
    if (!lastMessage || (lastMessage && lastMessage.seen)) {
      return;
    }

    const update = async () => {
      await updateSeen({ sender: userId });
    };

    update();
    updateSeenInConversation(queryClient, authUser._id, userId);
  }, [authUser, conversations, userId, updateSeen, queryClient]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const sendMessageListener = (data: any) => {
      addOrUpdateUserInConversationsList(queryClient, data);
    };

    socket.on(Events.SEND_MESSAGE, sendMessageListener);

    return () => {
      socket.off(Events.SEND_MESSAGE, sendMessageListener);
    };
  }, [authUser._id, queryClient, socket]);

  useEffect(() => {
    if (!user || !conversations) {
      return;
    }

    const exists = conversations.find((c) => c.sender._id === userId || c.receiver._id === userId);
    if (!exists) {
      const conversation = {
        sender: authUser,
        receiver: user,
        message: null,
        seen: true,
        createdAt: null,
        _id: uuid(),
      };
      addNewUserToConversationsList(queryClient, conversation, userId);
    }
  }, [user, conversations, userId, authUser, queryClient]);

  const onSearchItemClick = (user: any) => {
    router.push(`/messages/${user._id}`, undefined, { shallow: true });
  };

  return (
    <Root>
      <MessagesUsers
        isFetching={isConversationFetching}
        onSearchItemClick={onSearchItemClick}
        conversations={conversations || []}
        userId={userId}
      />

      <MessagesChat onSearchItemClick={onSearchItemClick} userId={userId} user={user} />
    </Root>
  );
};

export default Messages;
