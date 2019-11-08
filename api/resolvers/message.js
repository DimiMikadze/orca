import mongoose from 'mongoose';
import { withFilter } from 'apollo-server';

import { pubSub } from '../utils/apollo-server';
import { MESSAGE_CREATED, NEW_CONVERSATION } from '../constants/Subscriptions';

const Query = {
  /**
   * Gets user's specific conversation
   *
   * @param {string} authUserId
   * @param {string} userId
   */
  getMessages: async (root, { authUserId, userId }, { Message }) => {
    const specificMessage = await Message.find()
      .and([
        { $or: [{ sender: authUserId }, { receiver: authUserId }] },
        { $or: [{ sender: userId }, { receiver: userId }] },
      ])
      .populate('sender')
      .populate('receiver')
      .sort({ updatedAt: 'asc' });

    return specificMessage;
  },
  /**
   * Get users with whom authUser had a conversation
   *
   * @param {string} authUserId
   */
  getConversations: async (root, { authUserId }, { User, Message }) => {
    // Get users with whom authUser had a chat
    const users = await User.findById(authUserId).populate(
      'messages',
      'id username fullName image isOnline'
    );

    // Get last messages with wom authUser had a chat
    const lastMessages = await Message.aggregate([
      {
        $match: {
          $or: [
            {
              receiver: mongoose.Types.ObjectId(authUserId),
            },
            {
              sender: mongoose.Types.ObjectId(authUserId),
            },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: '$sender',
          doc: {
            $first: '$$ROOT',
          },
        },
      },
      { $replaceRoot: { newRoot: '$doc' } },
    ]);

    // Attach message properties to users
    const conversations = [];
    users.messages.map(u => {
      const user = {
        id: u.id,
        username: u.username,
        fullName: u.fullName,
        image: u.image,
        isOnline: u.isOnline,
      };

      const sender = lastMessages.find(m => u.id === m.sender.toString());
      if (sender) {
        user.seen = sender.seen;
        user.lastMessageCreatedAt = sender.createdAt;
        user.lastMessage = sender.message;
        user.lastMessageSender = false;
      } else {
        const receiver = lastMessages.find(m => u.id === m.receiver.toString());

        if (receiver) {
          user.seen = receiver.seen;
          user.lastMessageCreatedAt = receiver.createdAt;
          user.lastMessage = receiver.message;
          user.lastMessageSender = true;
        }
      }

      conversations.push(user);
    });

    // Sort users by last created messages date
    const sortedConversations = conversations.sort((a, b) =>
      b.lastMessageCreatedAt.toString().localeCompare(a.lastMessageCreatedAt)
    );

    return sortedConversations;
  },
};

const Mutation = {
  /**
   * Creates a message
   *
   * @param {string} message
   * @param {string} sender
   * @param {string} receiver
   */
  createMessage: async (
    root,
    { input: { message, sender, receiver } },
    { Message, User }
  ) => {
    let newMessage = await new Message({
      message,
      sender,
      receiver,
    }).save();

    newMessage = await newMessage
      .populate('sender')
      .populate('receiver')
      .execPopulate();

    // Publish message created event
    pubSub.publish(MESSAGE_CREATED, { messageCreated: newMessage });

    // Check if user already had a conversation
    // if not push their ids to users collection
    const senderUser = await User.findById(sender);
    if (!senderUser.messages.includes(receiver)) {
      await User.findOneAndUpdate(
        { _id: sender },
        { $push: { messages: receiver } }
      );
      await User.findOneAndUpdate(
        { _id: receiver },
        { $push: { messages: sender } }
      );

      newMessage.isFirstMessage = true;
    }

    // Publish message created event
    pubSub.publish(NEW_CONVERSATION, {
      newConversation: {
        receiverId: receiver,
        id: senderUser.id,
        username: senderUser.username,
        fullName: senderUser.fullName,
        image: senderUser.image,
        isOnline: senderUser.isOnline,
        seen: false,
        lastMessage: newMessage.message,
        lastMessageSender: false,
        lastMessageCreatedAt: newMessage.createdAt,
      },
    });

    return newMessage;
  },
  /**
   * Updates message seen values for user
   *
   * @param {string} userId
   */
  updateMessageSeen: async (
    root,
    { input: { sender, receiver } },
    { Message }
  ) => {
    try {
      await Message.update(
        { receiver, sender, seen: false },
        { seen: true },
        { multi: true }
      );

      return true;
    } catch (e) {
      return false;
    }
  },
};

const Subscription = {
  /**
   * Subscribes to message created event
   */
  messageCreated: {
    subscribe: withFilter(
      () => pubSub.asyncIterator(MESSAGE_CREATED),
      (payload, variables) => {
        const { sender, receiver } = payload.messageCreated;
        const { authUserId, userId } = variables;

        const isAuthUserSenderOrReceiver =
          authUserId === sender.id || authUserId === receiver.id;
        const isUserSenderOrReceiver =
          userId === sender.id || userId === receiver.id;

        return isAuthUserSenderOrReceiver && isUserSenderOrReceiver;
      }
    ),
  },

  /**
   * Subscribes to new conversations event
   */
  newConversation: {
    subscribe: withFilter(
      () => pubSub.asyncIterator(NEW_CONVERSATION),
      (payload, variables, { authUser }) =>
        authUser && authUser.id === payload.newConversation.receiverId
    ),
  },
};

export default { Mutation, Query, Subscription };
