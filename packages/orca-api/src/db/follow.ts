// @ts-nocheck
import Follow from '../models/follow';
import User from '../models/user';

export const followById = async (id: string): Promise<any> => {
  const follow = await Follow.findById(id);
  return follow;
};

export const createFollow = async (userId: string, followerId: string): Promise<any> => {
  const follow = await new Follow({
    user: userId,
    follower: followerId,
  }).save();

  // Push the follower/following to the user collection.
  await User.findOneAndUpdate({ _id: userId }, { $push: { followers: follow.id } });
  await User.findOneAndUpdate({ _id: followerId }, { $push: { following: follow.id } });

  return follow;
};

export const deleteFollow = async (id: string): Promise<any> => {
  const follow = await Follow.findByIdAndRemove(id);

  // Delete the follow from the user's collection.
  await User.findOneAndUpdate({ _id: follow.user }, { $pull: { followers: follow.id } });
  await User.findOneAndUpdate({ _id: follow.follower }, { $pull: { following: follow.id } });
  return follow;
};
