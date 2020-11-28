import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import { v4 as uuid } from 'uuid';
import { initPassport } from './authentication';

import models from './models';
import schema from './schema';
import resolvers from './resolvers';
import { createApolloServer } from './apollo-server';

// Connect to database
mongoose
  .connect(process.env.MONGO_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected'))
  .catch((err) => console.error(err));

initPassport();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(
  session({
    genid: (req) => uuid(),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: process.env.FRONTEND_URL,
    failureRedirect: process.env.FRONTEND_URL,
  })
);
app.get('/auth/logout', function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.log('Session destroy error: ', err);
    } else {
      console.log('Session destroyed');
    }
  });
  req.logout();
  res.redirect('/');
});

// Create a Apollo Server
const server = createApolloServer(schema, resolvers, models);
server.applyMiddleware({ app, path: '/graphql', cors: false });

// Create http server and add subscriptions to it
const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

// Listen to HTTP and WebSocket server
const PORT = process.env.PORT || process.env.API_PORT;
httpServer.listen({ port: PORT }, () => {
  console.log(`server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(`Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});
