import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import expressSession from 'express-session';
import connectMongo from 'connect-mongo';
import compression from 'compression';
import { v4 as uuid } from 'uuid';
import { initPassport } from './authentication';
import routes from './routes';

import models from './models';
import schema from './schema';
import resolvers from './resolvers';
import { createApolloServer } from './apollo-server';

const MongoStore = connectMongo(expressSession);

mongoose
  .connect(process.env.MONGO_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

initPassport();

const app = express();

app.use(compression());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
export const session = expressSession({
  genid: (req) => uuid(),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
});
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

const server = createApolloServer(schema, resolvers, models);
server.applyMiddleware({ app, path: '/graphql', cors: false });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

const PORT = process.env.PORT || process.env.API_PORT;
httpServer.listen({ port: PORT }, () => {
  console.log(`server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(`Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});
