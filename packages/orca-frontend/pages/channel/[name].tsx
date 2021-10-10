import { FC, Fragment } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { PostCard, PostCreateButton } from '../../components/Post';
import Layout from '../../components/Layout';
import { LoadingDots, Skeleton, Spacing } from '../../components/ui';
import { RootState } from '../../store';
import { Channel as ChannelType, DataLimit, Post } from '../../constants';
import { useInfiniteScroll } from '../../utils';
import Seo from '../../components/Seo';
import { GetServerSideProps } from 'next';
import { ChannelInfo } from '../../components/Channel';

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
  const authUser = useSelector((state: RootState) => state.auth.user);

  const { data, isFetching, isFetchingNextPage } = useInfiniteScroll({
    key: ['postsByChannelName', channel._id],
    apiCall: fetchPostsByChannelId,
    dataLimit: DataLimit.PostsByChannelName,
  });

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

      <div>
        {data?.pages?.map((posts, i) => {
          return (
            <Fragment key={i}>
              {posts?.map((post: Post) => (
                <PostCard queryKey={['postsByChannelName', channel._id]} key={post._id} post={post} />
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
