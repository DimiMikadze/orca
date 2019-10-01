import jwt from 'jsonwebtoken';

/**
 * Generates a token for user
 *
 * @param {object} user
 * @param {string} secret
 * @param {date} expiresIn
 */
export const generateToken = (user, secret, expiresIn) => {
  const { fullName, email } = user;

  return jwt.sign({ fullName, email }, secret, { expiresIn });
};
