import { Request, Response } from 'express';
import { deleteFromCloudinary } from '../utils/cloudinary';
import {
  getChannels,
  getChannelByName,
  createChannel,
  updateChannel,
  deleteChannel,
  deletePost,
  reorderChannels,
} from '../db';
import { getChannelPosts } from '../db';
import { ErrorCodes, ErrorMessages } from '../constants';

const channelNameReg = /[-!$%^&*()_+|~=`\\#{}[\]:";'<>?,./]/;

const ChannelController = {
  channels: async (req: Request, res: Response): Promise<any> => {
    const channels = await getChannels();
    return res.send(channels);
  },
  channelByName: async (req: Request, res: Response): Promise<any> => {
    const { name } = req.params;
    const channel = await getChannelByName(name);
    return res.send(channel);
  },
  create: async (req: Request, res: Response): Promise<any> => {
    const { name, authRequired, description, order } = req.body;
    const trimmedName = name.trim();

    if (channelNameReg.test(name) || !name || name.length > 20) {
      return res
        .status(ErrorCodes.Bad_Request)
        .send(`Channel names can only use letters, numbers, underscores, and periods by max character 20.`);
    }

    const channelExists = await getChannelByName(trimmedName);
    if (channelExists) {
      return res.status(ErrorCodes.Bad_Request).send(`A channel with the name "${trimmedName}" already exists.`);
    }

    const newChannel = await createChannel(trimmedName, authRequired, order, description);
    return res.send(newChannel);
  },
  update: async (req: Request, res: Response): Promise<any> => {
    const { _id, name, authRequired, description } = req.body;
    const trimmedName = name.trim();

    if (channelNameReg.test(trimmedName) || !trimmedName || trimmedName.length > 20) {
      return res
        .status(ErrorCodes.Bad_Request)
        .send(`Channel names can only use letters, numbers, underscores, and periods by max character 20.`);
    }

    const channelExists = await getChannelByName(trimmedName);
    if (channelExists && channelExists?._id.toString() !== _id) {
      return res.status(ErrorCodes.Bad_Request).send(`A channel with the name "${trimmedName}" already exists.`);
    }
    const updatedChannel = await updateChannel(_id, trimmedName, authRequired, description);
    return res.send(updatedChannel);
  },
  reorder: async (req: Request, res: Response): Promise<any> => {
    const { sortedChannels } = req.body;
    await reorderChannels(sortedChannels);
    return res.send('success');
  },
  delete: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.body;
    const channel = await deleteChannel(id);
    // Delete all channel posts, and their images from CDN.
    const relatedPosts = await getChannelPosts(channel._id);
    relatedPosts.map(async (post) => {
      if (post.imagePublicId) {
        const deleteImage = await deleteFromCloudinary(post.imagePublicId);
        if (deleteImage.result !== 'ok') {
          res.status(ErrorCodes.Internal).send(ErrorMessages.Generic);
        }
      }
      await deletePost(post._id);
    });

    return res.send(channel);
  },
};

export default ChannelController;
