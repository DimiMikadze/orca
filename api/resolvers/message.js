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
      .sort({ createdAt: 'desc' });

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
    const newMessage = await new Message({
      message,
      sender,
      receiver,
    }).save();

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

  /**
   * Deletes a message
   *
   * @param {string} id
   */
  deleteMessage: async (root, { input: { id } }, { Message }) => {
    const message = await Message.findByIdAndRemove(id);

    return message;
  },
};

export default { Mutation, Query };
