import jwt from 'jsonwebtoken';
import { ApolloServer } from 'apollo-server-express';
import { PubSub } from 'apollo-server';

import { IS_USER_ONLINE } from './constants/Subscriptions';
import { DocumentNode } from 'graphql';
import { AuthUser } from './constants/types';

export const pubSub = new PubSub();

interface ConnectionParams {
  authorization: string;
}

const checkAuthorization = (token: string): Promise<AuthUser> => {
  return new Promise((resolve, reject) => {
    try {
      const authUser: any = jwt.verify(token, process.env.SECRET);
      resolve(authUser);
    } catch (error) {
      reject("Couldn't authenticate user");
    }
  });
};

export const createApolloServer = (schema: DocumentNode, resolvers: any, models: any) => {
  return new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: async ({ req, connection }) => {
      if (connection) {
        return connection.context;
      }

      let authUser;
      if (req.headers.authorization !== 'null') {
        const user = await checkAuthorization(req.headers['authorization']);
        if (user) {
          authUser = user;
        }
      }

      return Object.assign({ authUser }, models);
    },
    subscriptions: {
      onConnect: async (connectionParams: ConnectionParams, webSocket) => {
        // Check if user is authenticated
        if (connectionParams.authorization) {
          try {
            const user = await checkAuthorization(connectionParams.authorization);

            // Publish user isOnline true
            pubSub.publish(IS_USER_ONLINE, {
              isUserOnline: {
                userId: user.id,
                isOnline: true,
              },
            });

            // Add authUser to socket's context, so we have access to it, in onDisconnect method
            return {
              authUser: user,
            };
          } catch (error) {}
        }
      },
      onDisconnect: async (webSocket, context) => {
        // Get socket's context
        const c = await context.initPromise;
        if (c && c.authUser) {
          // Publish user isOnline false
          pubSub.publish(IS_USER_ONLINE, {
            isUserOnline: {
              userId: c.authUser.id,
              isOnline: false,
            },
          });

          // Update user isOnline to false in DB
          await models.User.findOneAndUpdate(
            { email: c.authUser.email },
            {
              isOnline: false,
            }
          );
        }
      },
    },
  });
};
