export enum UserRole {
  Regular = 'Regular',
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin',
}

export interface AuthUser {
  _id: string;
  role: UserRole;
  fullName?: string;
  email?: string;
  createdAt?: Date;
  notifications: [];
  followers: [];
  following: [];
}

export interface Channel {
  _id?: string;
  name: string;
  authRequired: boolean;
  description?: string;
}

export interface Post {
  _id: string;
  title: string;
  image?: string;
  imagePublicId?: string;
  channel: Channel;
  author: any;
  createdAt: string;
  updatedAt: string;
  likes: [];
  comments: [];
  pinned?: boolean;
}
