import { gql } from 'apollo-server-express';

export default gql`
  type Message {
    id: ID!
    sender: User!
    receiver: User!
    message: String!
    createdAt: String
    updateAt: String
  }

  input CreateMessageInput {
    sender: ID!
    receiver: ID!
    message: String!
  }

  input UpdateMessageSeenInput {
    sender: ID
    receiver: ID!
  }

  type MessagePayload {
    id: ID!
    receiver: UserPayload
    sender: UserPayload
    message: String
    seen: Boolean
    createdAt: String
    isFirstMessage: Boolean
  }

  type ConversationsPayload {
    id: ID!
    username: String
    fullName: String
    image: String
    isOnline: Boolean
    seen: Boolean
    lastMessage: String
    lastMessageSender: Boolean
    lastMessageCreatedAt: String
  }

  extend type Query {
    getMessages(authUserId: ID!, userId: ID!): [MessagePayload]
    getConversations(authUserId: ID!): [ConversationsPayload]
  }

  extend type Mutation {
    createMessage(input: CreateMessageInput!): MessagePayload
    updateMessageSeen(input: UpdateMessageSeenInput!): Boolean
  }

  extend type Subscription {
    messageCreated(authUserId: ID!, userId: ID!): MessagePayload
    newConversation: ConversationsPayload
  }
`;
