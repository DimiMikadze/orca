import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  CoverPhoto,
  CoverLoading,
  ProfilePhoto,
  CoverImageWrapper,
  ProfileImageWrapper,
  Info,
  Actions,
  Count,
  Bold,
} from './style';
import UploadImage from '../UploadImage';
import Follow from '../Follow';
import { RootState } from '../../store';
import { Loading, H1, Spacing, ButtonLink, Avatar } from '../ui';
import { EnvelopeIcon } from '../ui/icons';

interface ProfileProps {
  user: any;
  queryKey: any;
}

export enum ProfileLoading {
  ProfilePicture,
  CoverPicture,
}

const Profile: FC<ProfileProps> = ({ user, queryKey }) => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [isLoading, setIsLoading] = useState<ProfileLoading>(null);
  return (
    <>
      <CoverPhoto isLoading={isLoading} image={authUser?._id === user._id ? authUser.coverImage : user.coverImage}>
        {isLoading === ProfileLoading.CoverPicture && (
          <CoverLoading>
            <Loading />
          </CoverLoading>
        )}
        {authUser?._id === user._id && (
          <CoverImageWrapper>
            <UploadImage isCover setIsLoading={setIsLoading} />
          </CoverImageWrapper>
        )}
        <ProfilePhoto>
          {isLoading === ProfileLoading.ProfilePicture ? (
            <Loading top="lg" />
          ) : (
            <Avatar
              isOnline={authUser?._id !== user._id && user.isOnline}
              image={authUser?._id === user._id ? authUser.image : user.image}
              size={4}
            />
          )}
          {authUser?._id === user._id && (
            <ProfileImageWrapper>
              <UploadImage setIsLoading={setIsLoading} />
            </ProfileImageWrapper>
          )}
        </ProfilePhoto>
      </CoverPhoto>

      <Info>
        <H1>{user.fullName}</H1>
      </Info>

      {authUser && authUser?._id !== user._id && (
        <Actions>
          <Follow user={user} queryKey={queryKey} />
          <Spacing left="sm" />
          <ButtonLink href={`/messages/${user._id}`}>
            <EnvelopeIcon color="primary" /> Message
          </ButtonLink>
        </Actions>
      )}
      <Count>
        <Spacing right="md">
          <Bold>{user.followers.length}</Bold>followers
        </Spacing>
        <Bold>{user.following.length}</Bold>following
      </Count>
    </>
  );
};

export default Profile;
