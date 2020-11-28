export enum UserRole {
  User,
  Moderator,
  Admin,
  SuperAdmin,
}

export interface AuthUser {
  _id: string;
  id: string;
  email: string;
  fullName: string;
  createdAt: Date;
}
