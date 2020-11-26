import { gql } from 'apollo-server-express';

import { Comment, CommentSchema, commentResolver } from './comment';
import { Follow, FollowSchema, followResolver } from './follow';
import { Like, LikeSchema, likeResolver } from './like';
import { Message, MessageSchema, messageResolver } from './message';
import { Notification, NotificationSchema, notificationResolver } from './notification';
import { Post, PostSchema, postResolver } from './post';
import { User, UserSchema, userResolver } from './user';

export const models = { Comment, Follow, Like, Message, Notification, Post, User };

export const schema = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }

  ${CommentSchema}
  ${FollowSchema}
  ${LikeSchema}
  ${MessageSchema}
  ${NotificationSchema}
  ${PostSchema}
  ${UserSchema}
`;

export const resolvers = [
  commentResolver,
  followResolver,
  likeResolver,
  messageResolver,
  notificationResolver,
  postResolver,
  userResolver,
];
