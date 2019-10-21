import { withFilter } from 'apollo-server';

import { pubSub } from '../utils/apollo-server';
import { MESSAGE_CREATED } from '../constants/Subscriptions';

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
      .sort({ createdAt: 'asc' });

    return specificMessage;
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
    const senderUser = await User.findById(sender).select('messages');
    if (!senderUser.messages.includes(receiver)) {
      await User.findOneAndUpdate(
        { _id: sender },
        { $push: { messages: receiver } }
      );
      await User.findOneAndUpdate(
        { _id: receiver },
        { $push: { messages: sender } }
      );
    }

    return newMessage;
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

        const isSender = sender.id === authUserId || sender.id === userId;
        const isReceiver = receiver.id === authUserId || receiver.id === userId;

        const result = isSender || isReceiver;

        return result;
      }
    ),
  },
};

export default { Mutation, Query, Subscription };
