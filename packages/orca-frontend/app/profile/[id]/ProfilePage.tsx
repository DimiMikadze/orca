'use client';

import { FC, Fragment } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../../components/Layout';
import { PostCard, PostCreateButton } from '../../../components/Post';
import Profile from '../../../components/Profile';
import Seo from '../../../components/Seo';
import { Container, Empty, LoadingDots, Skeleton, Spacing, Text } from '../../../components/ui';
import { DataLimit, Post } from '../../../constants';
import { RootState } from '../../../store';
import { useInfiniteScroll } from '../../../utils';
import { fetchPostsByAuthorId } from './fetch-user';

interface ProfilePageProps {
  user: any;
}

const ProfilePage: FC<ProfilePageProps> = ({ user }) => {
  const {
    data: posts,
    isFetching: isPostsFetching,
    isFetchingNextPage: isFetchingNextPosts,
    refetch,
  } = useInfiniteScroll({
    key: ['postsByAuthorId', user._id],
    apiCall: fetchPostsByAuthorId,
    dataLimit: DataLimit.PostsByAuthorId,
  });

  const authUser = useSelector((state: RootState) => state.auth.user);

  const isPostsLoading = isPostsFetching && !isFetchingNextPosts;
  const isEmpty = !posts?.pages[0] || posts.pages.every((p) => p.length === 0);

  if (!user) {
    return (
      <Layout marginTop="none" hideRightSidebar containerMaxWidth="xl">
        <Container centered padding="lg">
          <Empty>Oops! User not found.</Empty>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout marginTop="none" hideRightSidebar containerMaxWidth="xl">
      <>
        <Seo title={user.fullName} image={user.image} />
        <Profile user={user} queryKey={['userById', user._id]} />
        <Spacing bottom="sm" />
        <Container maxWidth="sm">
          {authUser && authUser._id === user._id && <PostCreateButton queryKey={['postsByAuthorId', user._id]} />}

          {isPostsLoading ? (
            <Skeleton height={300} count={6} bottom="sm" />
          ) : (
            <>
              {isEmpty && (
                <Container centered>
                  <Text color="textSecondary">{user.fullName} has not posted yet.</Text>
                </Container>
              )}

              {posts?.pages?.map((posts, i) => {
                return (
                  <Fragment key={i}>
                    {posts?.map((post: Post) => (
                      <PostCard
                        refetch={refetch}
                        displayChannelName
                        queryKey={['postsByAuthorId', user._id]}
                        key={post._id}
                        post={post}
                      />
                    ))}
                  </Fragment>
                );
              })}

              {isFetchingNextPosts && <LoadingDots />}
            </>
          )}
        </Container>
      </>
    </Layout>
  );
};

export default ProfilePage;
