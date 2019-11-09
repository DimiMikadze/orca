import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withApollo } from 'react-apollo';

import { Loading } from 'components/Loading';
import { UserIcon } from 'components/icons';

import { GET_AUTH_USER, GET_USER, UPLOAD_PHOTO } from 'graphql/user';
import { GET_FOLLOWED_POSTS } from 'graphql/post';

import { MAX_USER_PROFILE_IMAGE_SIZE } from 'constants/ImageSize';

import { useGlobalMessage } from 'hooks/useGlobalMessage';

import { useStore } from 'store';

const Input = styled.input`
  display: none;
`;

const Overlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  visibility: hidden;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  color: ${p => p.theme.colors.white};
  opacity: 0;
  transition: visibility 0.2s linear, opacity 0.2s linear;
`;

const Label = styled.label`
  position: relative;
  width: 180px;
  height: 180px;
  display: block;
  overflow: hidden;
  cursor: ${p => p.authUser && 'pointer'};
  border-radius: 50%;
  border: 4px solid ${p => p.theme.colors.border.main};
  background-color: ${p => p.theme.colors.white};

  &:hover ${Overlay} {
    opacity: 1;
    visibility: visible;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

/**
 * Displays and Updates user profile image
 */
const ProfileImageUpload = ({
  userId,
  image,
  imagePublicId,
  username,
  client,
}) => {
  const [{ auth }] = useStore();

  const [loading, setLoading] = useState(false);

  const message = useGlobalMessage();

  const handleImageChange = async e => {
    setLoading(true);

    const file = e.target.files[0];
    e.target.value = '';

    if (!file) return;

    if (file.size >= MAX_USER_PROFILE_IMAGE_SIZE) {
      setLoading(false);
      message.error(
        `File size should be less then ${MAX_USER_PROFILE_IMAGE_SIZE /
          1000000}MB`
      );
      return;
    }

    try {
      await client.mutate({
        mutation: UPLOAD_PHOTO,
        variables: { input: { id: auth.user.id, image: file, imagePublicId } },
        refetchQueries: () => [
          { query: GET_FOLLOWED_POSTS, variables: { userId: auth.user.id } },
          { query: GET_AUTH_USER },
          { query: GET_USER, variables: { username: auth.user.username } },
        ],
      });
    } catch (err) {
      message.error(err.graphQLErrors[0].message);
    }

    setLoading(false);
  };

  const renderProfileImage = () => {
    if (loading) {
      return <Loading top="xl" />;
    }

    return image ? (
      <Image src={image} alt="profile" accept="image/x-png,image/jpeg" />
    ) : (
      <UserIcon width="172" />
    );
  };

  const authUser = auth.user.id === userId;

  return (
    <>
      {authUser && (
        <Input
          name="image"
          type="file"
          id="image"
          accept="image/x-png,image/jpeg"
          onChange={handleImageChange}
        />
      )}

      <Label authUser={authUser} htmlFor="image">
        {authUser && <Overlay>{image ? 'Update' : 'Upload'}</Overlay>}

        {renderProfileImage()}
      </Label>
    </>
  );
};

ProfileImageUpload.propTypes = {
  image: PropTypes.string,
  imagePublicId: PropTypes.string,
  userId: PropTypes.string.isRequired,
  client: PropTypes.object.isRequired,
};

export default withApollo(ProfileImageUpload);
