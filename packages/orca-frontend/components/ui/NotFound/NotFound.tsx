import React, { FC } from 'react';
import { Root } from './style';
import { H1, H2, Link, Spacing } from '../../ui';
import { NotFoundIcon } from '../icons';

interface NotFoundProps {
  message?: string;
}

const NotFound: FC<NotFoundProps> = ({ message = "We can't seem to find the page you're looking for." }) => {
  return (
    <Root>
      <H1>Oops!</H1>

      <Spacing top="sm" bottom="md">
        <H2>{message}</H2>
      </Spacing>

      <NotFoundIcon width="100" />
      <Spacing bottom="md" />

      <Link href="/">Go back to Home Page</Link>
    </Root>
  );
};

export default NotFound;
