export enum UserRole {
  Regular = 'Regular',
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin',
}

export interface AuthUser {
  _id?: string;
  id: string;
  role: UserRole;
  fullName?: string;
  email?: string;
  createdAt: Date;
}
