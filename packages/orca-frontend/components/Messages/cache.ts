import { QueryClient } from 'react-query';

export const updateSeenInConversation = (queryClient: QueryClient, authUserId: string, userId: string): any => {
  queryClient.setQueryData(['conversations'], (existingConversations: any) => {
    if (!existingConversations) {
      return;
    }

    return existingConversations.map((c: any) => {
      if (c.sender._id === userId && c.receiver._id === authUserId) {
        return {
          ...c,
          seen: true,
        };
      }
      return c;
    });
  });
};

export const addNewUserToConversationsList = (queryClient: QueryClient, conversation: any, userId: string): any => {
  queryClient.setQueryData(['conversations'], (existingConversations: any) => {
    const exists = existingConversations.find((c) => c._id === userId);
    if (!exists) {
      return [conversation, ...existingConversations];
    }
    return existingConversations;
  });
};

export const addOrUpdateUserInConversationsList = (queryClient: QueryClient, data: any): any => {
  queryClient.setQueryData(['conversations'], (existingConversations: any) => {
    if (!existingConversations) {
      return;
    }

    const exists = existingConversations.find((c) => {
      return (
        (c.sender._id === data.sender._id && c.receiver._id === data.receiver._id) ||
        (c.sender._id === data.receiver._id && c.receiver._id === data.sender._id)
      );
    });

    if (exists) {
      return existingConversations.map((c) => {
        if (
          (c.sender._id === data.sender._id && c.receiver._id === data.receiver._id) ||
          (c.sender._id === data.receiver._id && c.receiver._id === data.sender._id)
        ) {
          return {
            ...c,
            seen: false,
            message: data.message,
          };
        }

        return c;
      });
    }

    return [
      {
        ...data,
      },
      ...existingConversations,
    ];
  });
};

export const addToMessagesList = (queryClient: QueryClient, data: any, userId: string): any => {
  queryClient.setQueryData(['messages', userId], (existingMessages: any) => {
    if (!existingMessages) {
      return;
    }

    const exists = existingMessages.find((m) => m._id === data._id);

    if (exists) {
      return existingMessages;
    }

    return [
      ...existingMessages,
      {
        ...data,
      },
    ];
  });
};
