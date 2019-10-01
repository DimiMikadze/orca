import {} from 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import models from './models';
import schema from './schema';
import resolvers from './resolvers';
import { createApolloServer } from './utils/apollo-server';

// Connect to database
mongoose
  .connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true }
  )
  .then(() => console.log('DB connected'))
  .catch(err => console.error(err));

// Initializes application
const app = express();

// Enable cors
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));

// Create a Apollo Server
const server = createApolloServer(schema, resolvers, models);
server.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || process.env.API_PORT;
app.listen(PORT, () =>
  console.log(`🚀 API ready at ${PORT}${server.graphqlPath}`)
);
