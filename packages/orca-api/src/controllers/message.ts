import { Request, Response } from 'express';
import { getMessages, createMessage, getConversations, updateMessageSeen } from '../db/message';
import { AuthUser, ErrorCodes } from '../constants';

const MessageController = {
  conversations: async (req: Request, res: Response): Promise<any> => {
    const authUser = req.user as AuthUser;
    const users = await getConversations(authUser._id);
    return res.send(users);
  },
  messages: async (req: Request, res: Response): Promise<any> => {
    const authUser = req.user as AuthUser;
    const userId = req.query.userId as string;
    const message = await getMessages(authUser._id, userId);
    return res.send(message);
  },
  create: async (req: Request, res: Response): Promise<any> => {
    const { message, receiver } = req.body;
    const authUser = req.user as AuthUser;

    if (!message.trim()) {
      return res.status(ErrorCodes.Internal).send('Please insert a message.');
    }

    const newMessage = await createMessage(message, authUser._id, receiver);
    return res.send(newMessage);
  },
  updateMessageSeen: async (req: Request, res: Response): Promise<any> => {
    const { sender } = req.body;
    const authUser = req.user as AuthUser;
    const messages = updateMessageSeen(sender, authUser._id);
    return res.send(messages);
  },
};

export default MessageController;
