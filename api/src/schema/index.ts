import { gql } from 'apollo-server-express';

import User from './user';
import Post from './post';
import Message from './message';
import Like from './like';
import Follow from './follow';
import Comment from './comment';
import Notification from './notification';

const schema = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  type Subscription {
    _empty: String
  }

  ${User}
  ${Post}
  ${Message}
  ${Follow}
  ${Like}
  ${Comment}
  ${Notification}
`;

export default schema;
