import mongoose from 'mongoose';
import { Message, User } from '../models';

export const getConversations = async (authUserId: string): Promise<any> => {
  const lastConversations = await Message.aggregate([
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
      $project: {
        sender: 1,
        receiver: 1,
        message: 1,
        createdAt: 1,
        seen: 1,
        senderReceiver: ['$sender', '$receiver'],
      },
    },
    {
      $unwind: '$senderReceiver',
    },
    {
      $sort: {
        senderReceiver: 1,
      },
    },
    {
      $group: {
        _id: '$_id',
        senderReceiver: {
          $push: '$senderReceiver',
        },
        message: {
          $first: '$message',
        },
        createdAt: {
          $first: '$createdAt',
        },
        sender: {
          $first: '$sender',
        },
        receiver: {
          $first: '$receiver',
        },
        seen: {
          $first: '$seen',
        },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $group: {
        _id: '$senderReceiver',
        message: {
          $first: '$message',
        },
        createdAt: {
          $first: '$createdAt',
        },
        sender: {
          $first: '$sender',
        },
        receiver: {
          $first: '$receiver',
        },
        seen: {
          $first: '$seen',
        },
      },
    },
    {
      $lookup: { from: 'users', localField: 'sender', foreignField: '_id', as: 'sender' },
    },
    {
      $lookup: { from: 'users', localField: 'receiver', foreignField: '_id', as: 'receiver' },
    },
    { $unwind: '$sender' },
    { $unwind: '$receiver' },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  return lastConversations;
};

export const getMessages = async (authUserId: string, userId: string): Promise<any> => {
  const message = await Message.find()
    .and([
      { $or: [{ sender: authUserId }, { receiver: authUserId }] },
      { $or: [{ sender: userId }, { receiver: userId }] },
    ])
    .populate('sender', '-password')
    .populate('receiver', '-password')
    .sort({ updatedAt: 'asc' });
  return message;
};

export const createMessage = async (message: string, sender: string, receiver: string): Promise<any> => {
  let newMessage = await new Message({
    message,
    sender,
    receiver,
  }).save();

  newMessage = await newMessage.populate('sender').populate('receiver').execPopulate();

  // Check if user already had a conversation. If not push their ids to users collection.
  const senderUser = await User.findById(sender);
  if (!senderUser.messages.includes(receiver)) {
    await User.findOneAndUpdate({ _id: sender }, { $push: { messages: receiver } });
    await User.findOneAndUpdate({ _id: receiver }, { $push: { messages: sender } });
  }

  return newMessage;
};

export const updateMessageSeen = async (sender: string, receiver: string): Promise<any> => {
  const messages = await Message.updateMany({ sender, receiver, seen: false }, { seen: true }, { multi: true });
  return messages;
};
