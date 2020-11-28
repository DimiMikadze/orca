import { ApolloServer } from 'apollo-server-express';
import { PubSub } from 'apollo-server';
import { mySession } from './index';

import { IS_USER_ONLINE } from './constants/Subscriptions';
import { DocumentNode } from 'graphql';
import { Response } from 'express';

export const pubSub = new PubSub();

const getUserIdFromReq = (req: any): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    mySession(req, {} as Response, (err) => {
      if (err) {
        return reject(err);
      }
      if (!req.session || !req.session.passport || !req.session.passport.user) {
        return resolve(null);
      }

      try {
        return resolve(req.session.passport.user._id);
      } catch (err) {
        return resolve(null);
      }
    });
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

      const authUser = req.user;

      return Object.assign({ authUser }, models);
    },
    subscriptions: {
      onConnect: async (connectionParams, webSocket: any) => {
        try {
          const userId = await getUserIdFromReq(webSocket.upgradeReq);
          if (userId) {
            pubSub.publish(IS_USER_ONLINE, {
              isUserOnline: {
                userId,
                isOnline: true,
              },
            });
          }
          return { authUserId: userId };
        } catch (error) {
          console.error(error);
          return { authUserId: null };
        }
      },
      onDisconnect: async (webSocket, context) => {
        const ctx = await context.initPromise;
        if (ctx && ctx.authUserId) {
          pubSub.publish(IS_USER_ONLINE, {
            isUserOnline: {
              userId: ctx.authUserId,
              isOnline: false,
            },
          });
          await models.User.findOneAndUpdate({ _id: ctx.authUserId }, { isOnline: false });
        }
      },
    },
  });
};
