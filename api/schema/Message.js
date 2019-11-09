import { gql } from 'apollo-server-express';

/**
 * Message schema
 */
const MessageSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type Message {
    id: ID!
    sender: User!
    receiver: User!
    message: String!
    createdAt: String
    updateAt: String
  }

  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreateMessageInput {
    sender: ID!
    receiver: ID!
    message: String!
  }

  input UpdateMessageSeenInput {
    sender: ID
    receiver: ID!
  }

  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
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

  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
    # Gets user's messages
    getMessages(authUserId: ID!, userId: ID!): [MessagePayload]

    # Gets user's conversations
    getConversations(authUserId: ID!): [ConversationsPayload]
  }

  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a message
    createMessage(input: CreateMessageInput!): MessagePayload

    # Updates message seen values for user
    updateMessageSeen(input: UpdateMessageSeenInput!): Boolean
  }

  # ---------------------------------------------------------
  # Subscriptions
  # ---------------------------------------------------------
  extend type Subscription {
    # Subscribes to message created event
    messageCreated(authUserId: ID!, userId: ID!): MessagePayload

    # Subscribes to new conversation event
    newConversation: ConversationsPayload
  }
`;

export default MessageSchema;
