import React, { FC } from 'react';
import { Root, PostImage, Action, Image, Item } from './style';
import { Avatar, Link } from '../ui';

interface NotificationProps {
  notification: any;
}

const Notification: FC<NotificationProps> = ({ notification }) => {
  return (
    <Root>
      <Item>
        <Link disableBorderOnHover href={`/profile/${notification.author._id}`}>
          <Avatar fullName={notification.author.fullName} image={notification.author.image} />
        </Link>

        {notification.like && (
          <Action>
            <div>
              liked your{' '}
              <Link disableBorderOnHover href={`/post/${notification.like.post._id}`} size="sm">
                post
              </Link>
            </div>
            {notification.like.post.image && (
              <Link disableBorderOnHover href={`/post/${notification.like.post._id}`}>
                <PostImage>
                  <Image alt="Post" src={notification.like.post.image} />
                </PostImage>
              </Link>
            )}
          </Action>
        )}

        {notification.follow && <Action>started following you</Action>}

        {notification.comment && (
          <Action>
            <div>
              commented on your{' '}
              <Link disableBorderOnHover href={`/post/${notification.comment.post._id}`}>
                post
              </Link>
            </div>
            {notification.comment.post.image && (
              <Link disableBorderOnHover href={`/post/${notification.comment.post._id}`}>
                <PostImage>
                  <Image alt="Member" src={notification.comment.post.image} />
                </PostImage>
              </Link>
            )}
          </Action>
        )}

        {notification.message && (
          <Action>
            <Link size="sm" href={`/messages/${notification.author._id}`}>
              messaged you
            </Link>
          </Action>
        )}
      </Item>
    </Root>
  );
};

export default Notification;
