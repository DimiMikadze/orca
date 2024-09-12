import axios from 'axios';
import ProfilePage from './ProfilePage';

const fetchUser = async ({ queryKey }) => {
  const [, id] = queryKey;
  const { data } = await axios.get(`http://localhost:4000/users/${id}`);
  // const { data } = await axios.get(`http://localhost:4000/users/66e29ebf70b5f0eb206bd284`);
  return data;
};

export const Page = async ({ params }) => {
  const user = await fetchUser({ queryKey: ['user', params.id] });
  return <ProfilePage user={user} />;
};

export default Page;
