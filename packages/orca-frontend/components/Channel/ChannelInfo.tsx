import React, { FC } from 'react';
import { H1, P, Container, Spacing } from '../ui';

interface ChannelInfoProps {
  name: string;
  description?: string;
}

const ChannelInfo: FC<ChannelInfoProps> = ({ name, description }) => {
  return (
    <Container paddingHorizontal="sm" paddingVertical="xs" bgColor="white" shadow="sm">
      <H1 size="md">{name}</H1>
      {description && (
        <Spacing top="xxs">
          <P color="textSecondary" size="xs">
            {description}
          </P>
        </Spacing>
      )}
    </Container>
  );
};

export default ChannelInfo;
