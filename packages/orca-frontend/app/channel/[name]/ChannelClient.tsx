'use client';

import { FC, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChannelInfo } from '../../../components/Channel';
import Layout from '../../../components/Layout';
import { PostCard, PostCreateButton } from '../../../components/Post';
import Seo from '../../../components/Seo';
import { Button, Container, LoadingDots, Skeleton, Spacing, Text } from '../../../components/ui';
import { CommunityIcon } from '../../../components/ui/icons';
import { Channel as ChannelType, DataLimit, Post } from '../../../constants';
import { RootState } from '../../../store';
import { PopupType, openAuthPopup } from '../../../store/auth';
import { useInfiniteScroll } from '../../../utils';

interface ChannelProps {
  channel: ChannelType;
}

const ChannelClient: FC<ChannelProps> = ({ channel }) => {
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth.user);

  const { data, isFetching, isFetchingNextPage, refetch } = useInfiniteScroll({
    key: ['postsByChannelName', channel._id],
    apiCall: async ({ queryKey, pageParam = 0 }) => {
      const [, channelId] = queryKey;
      const { data } = await axios.get(
        `/posts/channel/${channelId}?offset=${pageParam}&limit=${DataLimit.PostsByChannelName}`
      );
      return data;
    },
    dataLimit: DataLimit.PostsByChannelName,
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

  return (
    <Layout>
      <Seo title={channel.name} />

      <Spacing bottom="sm">
        <ChannelInfo name={channel.name} description={channel.description} />
      </Spacing>

      {authUser && <PostCreateButton queryKey={['postsByChannelName', channel._id]} channel={channel} />}

      {!authUser && (
        <Spacing bottom="sm">
          <Container centered padding="lg" bgColor="white" shadow="sm">
            <CommunityIcon width="40" />

            <Spacing top="sm">
              <Button inline onClick={openAuthModal} color="primary">
                Sign up
              </Button>

              <Spacing top="sm">
                <Text>To post in {channel.name} channel</Text>
              </Spacing>
            </Spacing>
          </Container>
        </Spacing>
      )}

      <div>
        {data?.pages?.map((posts, i) => {
          return (
            <Fragment key={i}>
              {posts?.map((post: Post) => (
                <PostCard refetch={refetch} queryKey={['postsByChannelName', channel._id]} key={post._id} post={post} />
              ))}
            </Fragment>
          );
        })}

        {isFetchingNextPage && <LoadingDots />}
      </div>
    </Layout>
  );
};

export default ChannelClient;
