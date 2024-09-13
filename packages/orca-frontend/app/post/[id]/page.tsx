import { fetchPost } from './fetch-post';
import PostPage from './PostPage';

const Page = async ({ params }) => {
  const post = await fetchPost({ queryKey: ['post', params.id] });
  return <PostPage post={post} />;
};

export default Page;
