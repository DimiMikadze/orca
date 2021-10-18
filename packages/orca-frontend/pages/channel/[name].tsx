import { FC, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { PostCard, PostCreateButton } from '../../components/Post';
import Layout from '../../components/Layout';
import { LoadingDots, Skeleton, Spacing, Container, Button, Text } from '../../components/ui';
import { RootState } from '../../store';
import { Channel as ChannelType, DataLimit, Post } from '../../constants';
import { useInfiniteScroll } from '../../utils';
import Seo from '../../components/Seo';
import { GetServerSideProps } from 'next';
import { ChannelInfo } from '../../components/Channel';
import { CommunityIcon } from '../../components/ui/icons';
import { openAuthPopup, PopupType } from '../../store/auth';

const fetchChannelByName = async (channelName: string) => {
  const { data } = await axios.get(`/channels/${channelName}`);
  return data;
};

const fetchPostsByChannelId = async ({ queryKey, pageParam = 0 }) => {
  const [, channelId] = queryKey;
  const { data } = await axios.get(
    `/posts/channel/${channelId}?offset=${pageParam}&limit=${DataLimit.PostsByChannelName}`
  );
  return data;
};

interface ChannelProps {
  channel: ChannelType;
}

const Channel: FC<ChannelProps> = ({ channel }) => {
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth.user);

  const { data, isFetching, isFetchingNextPage, refetch } = useInfiniteScroll({
    key: ['postsByChannelName', channel._id],
    apiCall: fetchPostsByChannelId,
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const channel = await fetchChannelByName(params.name as string);
  return { props: { channel: channel } };
};

export default Channel;
