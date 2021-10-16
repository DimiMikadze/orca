import Channel from '../models/channel';

export const getChannels = async (): Promise<any> => {
  const channels = await Channel.find({}).sort({ order: 1 });
  return channels;
};

export const getChannelByName = async (name: string): Promise<any> => {
  const channel = await Channel.findOne({ name });
  return channel;
};

export const createChannel = async (
  name: string,
  authRequired: boolean,
  order: number,
  description?: string
): Promise<any> => {
  const newChannel = await Channel.create({
    name,
    authRequired,
    order,
    description,
  });
  return newChannel;
};

export const updateChannel = async (
  id: string,
  name: string,
  authRequired: boolean,
  description?: string
): Promise<any> => {
  const updatedChannel = await Channel.findOneAndUpdate(
    { _id: id },
    { name, authRequired, description },
    { new: true }
  );
  return updatedChannel;
};

export const reorderChannels = async (sortedChannels: any) => {
  sortedChannels.forEach(async (channel, index) => {
    await Channel.findOneAndUpdate({ _id: channel._id }, { order: index }, { new: true });
  });

  return 'success';
};

export const deleteChannel = async (id: string): Promise<any> => {
  const deletedChannel = await Channel.findByIdAndRemove(id);
  return deletedChannel;
};
