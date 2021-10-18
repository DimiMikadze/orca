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
  facebookId?: string;
  googleId?: string;
  githubId?: string;
  about?: string;
  website?: string;
}

export interface AuthSocialPayload {
  auth: 'social';
  responseType: 'success' | 'error';
  provider: 'Github' | 'Facebook' | 'Google';
  token: string;
}
