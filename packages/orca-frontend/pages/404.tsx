import { FC } from 'react';
import Seo from '../components/Seo';
import { NotFound } from '../components/ui';

const NotFoundPage: FC = () => {
  return (
    <>
      <Seo title="Not Found" />
      <NotFound message="we can't find the page you're looking for" />
    </>
  );
};

export default NotFoundPage;
