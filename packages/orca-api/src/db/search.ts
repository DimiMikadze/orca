import { Post, User } from '../models';
import { checkEmailVerification } from '../utils';

export const searchUsers = async (searchQuery: string, authUserId?: string): Promise<any> => {
  if (!searchQuery) {
    return [];
  }

  const isEmailVerificationRequired = await checkEmailVerification();
  const andQuery: any = [{ banned: { $ne: true } }];
  if (isEmailVerificationRequired) {
    andQuery[0].emailVerified = true;
  }

  const query = {
    $and: andQuery,
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

export const searchAll = async (searchQuery: string, authUserId?: string): Promise<any> => {
  if (!searchQuery) {
    return [];
  }

  const users = await searchUsers(searchQuery, authUserId);
  const posts = await Post.find({ title: new RegExp(searchQuery, 'i') }).limit(50);
  const result = [...users, ...posts];
  return result.sort((a: any, b: any) => a.createdAt - b.createdAt);
};
