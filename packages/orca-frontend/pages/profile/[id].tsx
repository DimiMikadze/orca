import { FC, Fragment } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Layout from '../../components/Layout';
import Profile from '../../components/Profile';
import { PostCard, PostCreateButton } from '../../components/Post';
import { DataLimit, Post } from '../../constants';
import { useInfiniteScroll } from '../../utils';
import { Container, Empty, LoadingDots, Skeleton, Spacing, Text } from '../../components/ui';
import Seo from '../../components/Seo';
import { GetServerSideProps } from 'next';

const fetchUser = async ({ queryKey }) => {
  const [, id] = queryKey;
  const { data } = await axios.get(`/users/${id}`);
  return data;
};

const fetchPostsByAuthorId = async ({ queryKey, pageParam = 0 }) => {
  const [, authorId] = queryKey;
  const { data } = await axios.get(`/posts/author/${authorId}?offset=${pageParam}&limit=${DataLimit.PostsByAuthorId}`);
  return data;
};

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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const user = await fetchUser({ queryKey: ['user', params.id] });
  return {
    props: {
      user,
    },
  };
};

export default ProfilePage;
