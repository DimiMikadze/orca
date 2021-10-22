import { FC } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import { PostCard } from '../../components/Post';
import { Container } from '../../components/ui';
import Seo from '../../components/Seo';
import { GetServerSideProps } from 'next';
import { useQuery } from 'react-query';

const fetchPost = async ({ queryKey }) => {
  const [, postId] = queryKey;
  const { data } = await axios.get(`/posts/${postId}`);
  return data;
};

interface ProfilePageProps {
  post: any;
}

const PostPage: FC<ProfilePageProps> = ({ post }) => {
  const { data, refetch } = useQuery(['post', post._id], fetchPost, { initialData: post });

  return (
    <Layout hideRightSidebar marginTop="none">
      <Seo title={post.title} image={post.image} />

      <Container maxWidth="md" marginTop="sm">
        <PostCard
          refetch={refetch}
          disableNavigation
          isCommentsOpen
          displayChannelName
          queryKey={['post', data._id]}
          post={data}
        />
      </Container>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await fetchPost({ queryKey: ['post', params.id] });
  return {
    props: {
      post,
    },
  };
};

export default PostPage;
