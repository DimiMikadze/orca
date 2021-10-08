import { FC } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { Messages } from '../../components/Messages';
import { isAuthorized, redirectToHome } from '../../utils';
import { GetServerSideProps } from 'next';
import Seo from '../../components/Seo';

const MessagesPage: FC = () => {
  const router = useRouter();
  const userId = router.query.id as string;

  return (
    <Layout hideRightSidebar containerMaxWidth="md" marginTop="none">
      <Seo title="Messages" />
      <Messages userId={userId} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const isAuth = await isAuthorized(req);
  if (!isAuth) {
    return redirectToHome();
  }

  return { props: {} };
};

export default MessagesPage;
