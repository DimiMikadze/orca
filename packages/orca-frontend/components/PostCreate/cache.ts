import { Post } from '../../constants';

/**
 * Cache update for the post can happen in a multiple pages:
 * - Home page (postsByFollowing): Users can create or update post on the home page.
 * - Profile page (["postsByAuthorId", {id}]): Users can create or update post on the profile page.
 * - Post detail page (["post", {id}]): Users can only update post on the post detail page.
 * - Channels page (["postsByChannelName", {id}]): Users can create or update post on the channel page.
 */

interface updateCacheProps {
  queryKey: any | any;
  queryClient: any;
  operation: 'create' | 'update';
  post: Post;
  // We don't need to update the cache when a user is adding a post from the channel `a's` page to the channel `b`.
  notAddingToCurrentChannel?: boolean;
}

export const updatePostsByFollowingAndAuthorIdCache = ({
  queryKey,
  queryClient,
  operation,
  post,
}: updateCacheProps) => {
  if (operation === 'create') {
    queryClient.setQueryData(queryKey, (existingPosts: any) => {
      return {
        ...existingPosts,
        pages: [[post], ...existingPosts.pages],
      };
    });
    return;
  }

  queryClient.setQueryData(queryKey, (existingPosts: any) => {
    return {
      ...existingPosts,
      pages: existingPosts.pages.map((posts: Post[]) => {
        return posts.map((p: Post) => {
          if (p._id === post._id) {
            return {
              ...p,
              title: post.title,
              image: post.image,
              imagePublicId: post.imagePublicId,
              channelId: post.channel._id,
            };
          } else {
            return p;
          }
        });
      }),
    };
  });
};

export const updateSinglePost = ({ queryKey, queryClient, post }: updateCacheProps) => {
  queryClient.setQueryData(queryKey, (existingPost: any) => {
    return {
      ...existingPost,
      title: post.title,
      image: post.image,
      imagePublicId: post.imagePublicId,
      channelId: post.channel._id,
    };
  });
};

export const updatePostsByChannelName = ({
  queryKey,
  queryClient,
  post,
  operation,
  notAddingToCurrentChannel,
}: updateCacheProps) => {
  // If a user is creating a post, not on a current channel's page, we don't need to update the cache.
  // It will be updated when the user navigates to that specific channel page automatically.
  if (notAddingToCurrentChannel && operation === 'create') {
    return;
  }

  // If a user has changed the post's channel to another channel, we need to remove it from the list of the current posts.
  if (notAddingToCurrentChannel && operation === 'update') {
    queryClient.setQueryData(queryKey, (existingPosts: any) => {
      return {
        ...existingPosts,
        pages: existingPosts.pages.map((posts: Post[]) => {
          return posts.filter((p: Post) => p._id !== post._id);
        }),
      };
    });
    return;
  }

  updatePostsByFollowingAndAuthorIdCache({ queryKey, queryClient, post, operation });
};

export const updateCache = ({
  queryKey,
  queryClient,
  operation,
  post,
  notAddingToCurrentChannel,
}: updateCacheProps) => {
  let key = '';
  if (typeof queryKey === 'string' && queryKey !== 'postsByFollowing') {
    console.error(`updateCache error: ${queryKey} is an unknown cache key.`);
    return;
  }

  const keys = ['postsByAuthorId', 'postsByChannelName', 'post'];
  if (Array.isArray(queryKey) && !keys.includes(queryKey[0])) {
    console.error(`updateCache error: ${queryKey} is an unknown cache key.`);
    return;
  }
  key = typeof queryKey === 'string' ? queryKey : queryKey[0];

  switch (key) {
    case 'postsByFollowing':
    case 'postsByAuthorId':
      updatePostsByFollowingAndAuthorIdCache({ queryKey, queryClient, operation, post });
      break;
    case 'post':
      updateSinglePost({ queryKey, queryClient, operation, post });
      break;
    case 'postsByChannelName':
      updatePostsByChannelName({ queryKey, queryClient, operation, post, notAddingToCurrentChannel });
    default:
      break;
  }
};
