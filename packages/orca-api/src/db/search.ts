import { Post, User } from '../models';

export const searchUsers = async (searchQuery: string, authUserId?: string): Promise<any> => {
  if (!searchQuery) {
    return [];
  }

  const query = {
    $and: [{ emailVerified: true, banned: { $ne: true } }],
    $or: [{ username: new RegExp(searchQuery, 'i') }, { fullName: new RegExp(searchQuery, 'i') }],
  };

  if (authUserId) {
    query['_id'] = {
      $ne: authUserId,
    };
  }

  const users = User.find(query).select('-password').limit(50);

  return users;
};

export const searchAll = async (searchQuery: string): Promise<any> => {
  if (!searchQuery) {
    return [];
  }

  const users = await searchUsers(searchQuery);
  const posts = await Post.find({ title: new RegExp(searchQuery, 'i') }).limit(50);
  const result = [...users, ...posts];
  return result.sort((a: any, b: any) => a.createdAt - b.createdAt);
};
