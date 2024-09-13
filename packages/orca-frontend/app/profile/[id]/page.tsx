import { fetchUser } from './fetch-user';
import ProfilePage from './ProfilePage';

const Page = async ({ params }) => {
  const user = await fetchUser({ queryKey: ['user', params.id] });
  return <ProfilePage user={user} />;
};

export default Page;
