import { FC, Fragment } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout';
import { useInfiniteScroll } from '../utils';
import { DataLimit, Post } from '../constants';
import { RootState } from '../store';
import { PostCard, PostCreateButton } from '../components/Post';
import { Container, Button, Spacing, LoadingDots, Skeleton, Text } from '../components/ui';
import { openAuthPopup, PopupType } from '../store/auth';
import { CommunityIcon } from '../components/ui/icons';
import Seo from '../components/Seo';

const fetchPostsByFollowing = async ({ pageParam = 0 }) => {
  const { data } = await axios.get(`/posts/follow?offset=${pageParam}&limit=${DataLimit.PostsByFollowing}`);
  return data;
};

const Home: FC = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const { data, isFetching, isFetchingNextPage } = useInfiniteScroll({
    key: 'postsByFollowing',
    apiCall: fetchPostsByFollowing,
    enabled: authUser !== null,
    dataLimit: DataLimit.PostsByFollowing,
  });

  const openAuthModal = () => {
    dispatch(openAuthPopup(PopupType.Sign_Up));
  };

  if (isFetching && !isFetchingNextPage) {
    return (
      <Layout>
        <Skeleton count={10} height={300} bottom="sm" />
      </Layout>
    );
  }

  const isEmpty = !data?.pages[0] || data.pages.every((p) => p.length === 0);

  return (
    <Layout>
      <Seo title="Home" />
      <div>
        {authUser && <PostCreateButton queryKey="postsByFollowing" />}

        {isEmpty && (
          <Container centered padding="lg" bgColor="white" shadow="sm">
            <CommunityIcon width="40" />

            <Spacing top="sm">
              {!authUser && (
                <Button inline onClick={openAuthModal} color="primary">
                  Sign up
                </Button>
              )}
              <Spacing top="sm">
                <Text>{!authUser && 'And'} Follow community members to see their posts in the News Feed.</Text>
              </Spacing>
            </Spacing>
          </Container>
        )}

        {data?.pages?.map((posts, i) => {
          return (
            <Fragment key={i}>
              {posts?.map((post: Post) => (
                <PostCard displayChannelName queryKey="postsByFollowing" key={post._id} post={post} />
              ))}

              {isFetchingNextPage && <LoadingDots />}
            </Fragment>
          );
        })}
      </div>
    </Layout>
  );
};

export default Home;
