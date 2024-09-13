export const fetchPost = async ({ queryKey }) => {
  const [, postId] = queryKey;
  const data = await (await fetch(`http://localhost:4000/posts/${postId}`)).json();
  console.log(data);
  return data;
};
