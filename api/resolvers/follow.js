const Mutation = {
  /**
   * Creates a following/follower relationship between users
   *
   * @param {string} userId
   * @param {string} followerId
   */
  createFollow: async (
    root,
    { input: { userId, followerId } },
    { Follow, User }
  ) => {
    const follow = await new Follow({
      user: userId,
      follower: followerId,
    }).save();

    // Push follower/following to user collection
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { followers: follow.id } }
    );
    await User.findOneAndUpdate(
      { _id: followerId },
      { $push: { following: follow.id } }
    );

    return follow;
  },
  /**
   * Deletes a following/follower relationship between users
   *
   * @param {string} id follow id
   */
  deleteFollow: async (root, { input: { id } }, { Follow, User }) => {
    const follow = await Follow.findByIdAndRemove(id);

    // Delete follow from users collection
    await User.findOneAndUpdate(
      { _id: follow.user },
      { $pull: { followers: follow.id } }
    );
    await User.findOneAndUpdate(
      { _id: follow.follower },
      { $pull: { following: follow.id } }
    );

    return follow;
  },
};

export default { Mutation };
