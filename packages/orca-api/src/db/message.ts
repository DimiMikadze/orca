import mongoose from 'mongoose';
import { Message, User } from '../models';
import { IMessage } from '../models/message';

export interface IConversation {
  _id: mongoose.Types.ObjectId[];
  message: string;
  createdAt: Date;
  sender: {
    _id: mongoose.Types.ObjectId;
    username: string;
  };
  receiver: {
    _id: mongoose.Types.ObjectId;
    username: string;
  };
  seen: boolean;
}

export const getConversations = async (authUserId: string) => {
  const lastConversations = await Message.aggregate<IConversation>([
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

export const getMessages = async (authUserId: string, userId: string): Promise<IMessage[]> => {
  const message = await Message.find()
    .and([
      { $or: [{ sender: mongoose.Types.ObjectId(authUserId) }, { receiver: mongoose.Types.ObjectId(authUserId) }] },
      { $or: [{ sender: mongoose.Types.ObjectId(userId) }, { receiver: mongoose.Types.ObjectId(userId) }] },
    ])
    .populate('sender', '-password')
    .populate('receiver', '-password')
    .sort({ updatedAt: 'asc' });
  return message;
};

export const createMessage = async (message: string, sender: string, receiver: string): Promise<IMessage> => {
  let newMessage = await new Message({
    message,
    sender,
    receiver,
  }).save();

  newMessage = await newMessage.populate('sender').populate('receiver').execPopulate();

  // Check if user already had a conversation. If not push their ids to users collection.
  const senderUser = await User.findById(sender);
  if (!senderUser.messages.includes(mongoose.Types.ObjectId(receiver))) {
    await User.findOneAndUpdate({ _id: sender }, { $push: { messages: receiver } });
    await User.findOneAndUpdate({ _id: receiver }, { $push: { messages: sender } });
  }

  return newMessage;
};

export const updateMessageSeen = async (sender: string, receiver: string) => {
  const messages = await Message.updateMany({ sender, receiver, seen: false }, { seen: true }, { multi: true });
  return messages;
};
