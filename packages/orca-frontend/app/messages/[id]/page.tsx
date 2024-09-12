'use client';

import { useParams } from 'next/navigation';
import Layout from '../../../components/Layout';
import { Messages } from '../../../components/Messages';
import Seo from '../../../components/Seo';

const Page = () => {
  const params = useParams();

  return (
    <Layout hideRightSidebar containerMaxWidth="md" marginTop="none">
      <Seo title="Messages" />
      <Messages userId={params.id as string} />
    </Layout>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   const isAuth = await isAuthorized(req);
//   if (!isAuth) {
//     return redirectToHome();
//   }

//   return { props: {} };
// };

export default Page;
