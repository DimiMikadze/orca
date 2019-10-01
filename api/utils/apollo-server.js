import jwt from 'jsonwebtoken';
import { ApolloServer } from 'apollo-server-express';

/**
 * Checks if client is authenticated by checking authorization key from req headers
 *
 * @param {obj} req
 */
const checkAuthorization = async req => {
  const token = req.headers['authorization'];

  if (token !== 'null') {
    try {
      const authUser = await jwt.verify(token, process.env.SECRET);

      return authUser;
    } catch (err) {
      console.error(err);
    }
  }
};

/**
 * Creates an Apollo server and identifies if user is authenticated or not
 *
 * @param {obj} schema GraphQL Schema
 * @param {array} resolvers GraphQL Resolvers
 * @param {obj} models Mongoose Models
 */
export const createApolloServer = (schema, resolvers, models) => {
  return new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: async ({ req, connection }) => {
      if (connection) {
        return Object.assign({}, models);
      }

      if (req) {
        const authUser = await checkAuthorization(req);
        req.authUser = authUser;

        return Object.assign({ authUser }, models);
      }
    },
  });
};
