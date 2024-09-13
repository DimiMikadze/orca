import axios from 'axios';
import { DataLimit } from '../../../constants';

export const fetchUser = async ({ queryKey }) => {
  const [, id] = queryKey;
  const data = await (await fetch(`http://localhost:4000/users/${id}`, { method: 'GET' })).json();
  return data;
};

export const fetchPostsByAuthorId = async ({ queryKey, pageParam = 0 }) => {
  const [, authorId] = queryKey;
  const { data } = await axios.get(
    `http://localhost:4000/posts/author/${authorId}?offset=${pageParam}&limit=${DataLimit.PostsByAuthorId}`
  );
  return data;
};
