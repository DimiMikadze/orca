import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import styled from 'styled-components';

import { Spacing, Overlay, Container } from 'components/Layout';
import { Error } from 'components/Text';
import { Button } from 'components/Form';
import Avatar from 'components/Avatar';

import PostImageUpload from 'pages/Home/PostImageUpload';

import { GET_FOLLOWED_POSTS, CREATE_POST } from 'graphql/post';
import { GET_AUTH_USER, GET_USER_POSTS } from 'graphql/user';

import { useStore } from 'store';

import { PROFILE_PAGE_POSTS_LIMIT } from 'constants/DataLimit';
import { HOME_PAGE_POSTS_LIMIT } from 'constants/DataLimit';
import { MAX_POST_IMAGE_SIZE } from 'constants/ImageSize';

import { useGlobalMessage } from 'hooks/useGlobalMessage';

const Root = styled(Container)`
  border: 0;
  border: 1px solid ${(p) => p.theme.colors.border.main};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${(p) => p.theme.spacing.sm} 0;
`;

const Textarea = styled.textarea`
  width: 100%;
  margin: 0 ${(p) => p.theme.spacing.xs};
  padding-left: ${(p) => p.theme.spacing.sm};
  padding-top: ${(p) => p.theme.spacing.xs};
  border: 0;
  outline: none;
  resize: none;
  transition: 0.1s ease-out;
  height: ${(p) => (p.focus ? '80px' : '40px')};
  font-size: ${(p) => p.theme.font.size.xs};
  background-color: ${(p) => p.theme.colors.grey[100]};
  border-radius: ${(p) => p.theme.radius.md};
`;

const ImagePreviewContainer = styled.div`
  width: 150px;
  height: 150px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: ${(p) => p.theme.shadows.sm};
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Options = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-top: 1px solid ${(p) => p.theme.colors.border.main};
  padding: ${(p) => p.theme.spacing.sm} 0;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
`;

/**
 * Component for creating a post
 */
const CreatePost = () => {
  const [{ auth }] = useStore();
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState(false);
  const message = useGlobalMessage();
  const [createPost, { loading }] = useMutation(CREATE_POST, {
    refetchQueries: [
      {
        query: GET_FOLLOWED_POSTS,
        variables: {
          userId: auth.user.id,
          skip: 0,
          limit: HOME_PAGE_POSTS_LIMIT,
        },
      },
      { query: GET_AUTH_USER },
      {
        query: GET_USER_POSTS,
        variables: {
          username: auth.user.username,
          skip: 0,
          limit: PROFILE_PAGE_POSTS_LIMIT,
        },
      },
    ],
  });

  const handleReset = () => {
    setTitle('');
    setImage('');
    setIsFocused(false);
    setError('');
    setApiError(false);
  };

  const handleOnFocus = () => setIsFocused(true);

  const handlePostImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size >= MAX_POST_IMAGE_SIZE) {
      message.error(`File size should be less then ${MAX_POST_IMAGE_SIZE / 1000000}MB`);
      return;
    }

    setImage(file);

    setIsFocused(true);
    e.target.value = null;
  };

  const handleTitleChange = (e) => setTitle(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({
        variables: { input: { title, image, authorId: auth.user.id } },
      });
      handleReset();
    } catch (error) {
      setApiError(true);
    }
  };

  const isShareDisabled = loading || (!loading && !image && !title);

  return (
    <>
      {isFocused && <Overlay onClick={handleReset} />}

      <Root zIndex={isFocused ? 'md' : 'xs'} color="white" radius="sm" padding="sm">
        <form onSubmit={handleSubmit}>
          <Wrapper>
            <Avatar image={auth.user.image} size={40} />

            <Textarea
              type="textarea"
              name="title"
              focus={isFocused}
              value={title}
              onFocus={handleOnFocus}
              onChange={handleTitleChange}
              placeholder="Add a post"
            />

            {!isFocused && <PostImageUpload handleChange={handlePostImageUpload} />}
          </Wrapper>

          {image && (
            <Spacing bottom="sm">
              <ImagePreviewContainer>
                <ImagePreview src={URL.createObjectURL(image)} />
              </ImagePreviewContainer>
            </Spacing>
          )}

          {isFocused && (
            <Options>
              <PostImageUpload label="Photo" handleChange={handlePostImageUpload} />

              <Buttons>
                <Button text type="button" onClick={handleReset}>
                  Cancel
                </Button>
                <Button disabled={isShareDisabled} type="submit">
                  Share
                </Button>
              </Buttons>
            </Options>
          )}

          {apiError ||
            (error && (
              <Spacing top="xs" bottom="sm">
                <Error size="xs">{apiError ? 'Something went wrong, please try again.' : error}</Error>
              </Spacing>
            ))}
        </form>
      </Root>
    </>
  );
};

export default CreatePost;
