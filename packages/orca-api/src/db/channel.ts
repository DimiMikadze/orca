import Channel from '../models/channel';

export const getChannels = async (): Promise<any> => {
  const channels = await Channel.find({});
  return channels;
};

export const getChannelByName = async (name: string): Promise<any> => {
  const channel = await Channel.findOne({ name });
  return channel;
};

export const createChannel = async (name: string, authRequired: boolean): Promise<any> => {
  const newChannel = await Channel.create({
    name,
    authRequired,
  });
  return newChannel;
};

export const updateChannel = async (id: string, name: string, authRequired: boolean): Promise<any> => {
  const updatedChannel = await Channel.findOneAndUpdate({ _id: id }, { name, authRequired }, { new: true });
  return updatedChannel;
};

export const deleteChannel = async (id: string): Promise<any> => {
  const deletedChannel = await Channel.findByIdAndRemove(id);
  return deletedChannel;
};
