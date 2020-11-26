import jwt from 'jsonwebtoken';
import { AuthUser } from '../constants/types';

export const generateToken = (user: AuthUser, secret: string, expiresIn: string | number) => {
  const { id, fullName, email } = user;

  return jwt.sign({ id, fullName, email }, secret, { expiresIn });
};
