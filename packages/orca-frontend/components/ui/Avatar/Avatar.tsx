import React, { FC } from 'react';
import { Root, Image, Online, Container, ImageContainer } from './style';
import { UserIcon } from '../../ui/icons';
import { Text, Spacing } from '../../ui';

interface AvatarProps {
  size?: number;
  image?: string;
  fullName?: string;
  isOnline?: boolean;
  isActive?: boolean;
}

const Avatar: FC<AvatarProps> = ({ size, image, fullName, isOnline, isActive }) => {
  return (
    <Root>
      <Container size={size}>
        <ImageContainer>{image ? <Image alt={fullName} src={image} /> : <UserIcon width="100%" />}</ImageContainer>
        {isOnline && <Online />}
      </Container>
      {fullName && (
        <Spacing left="xs">
          <Text size="sm" color={isActive ? 'primary' : 'text'}>
            {fullName}
          </Text>
        </Spacing>
      )}
    </Root>
  );
};

export default Avatar;
