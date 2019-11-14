import React from 'react';
import PropTypes from 'prop-types';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from 'components/Form';
import Follow from 'components/Follow';

import { useStore } from 'store';

import * as Routes from 'routes';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  background-color: ${p => p.theme.colors.white};
  border-radius: ${p => p.theme.radius.sm};
  z-index: ${p => p.theme.zIndex.lg};
  box-shadow: ${p => p.theme.shadows.xl};
`;

const FollowItem = styled.div`
  padding: ${p => p.theme.spacing.sm} 0;
  text-align: center;
`;

const StyledButton = styled(Button)`
  padding: ${p => p.theme.spacing.sm} 0;
  text-align: center;
  border-top: 1px solid ${p => p.theme.colors.border.main} !important;

  &:first-child {
    border-top: 0 !important ;
  }

  &:hover {
    background-color: ${p => p.theme.colors.grey[100]};
    color: ${p => p.theme.colors.text.primary};
  }
`;

/**
 * Post Card options, meant to be used in PostCard components Modal
 */
const PostCardOption = ({ postId, author, closeOption, deletePost }) => {
  const [{ auth }] = useStore();

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(
        `${process.env.REACT_APP_FRONTEND_URL}${generatePath(Routes.POST, {
          id: postId,
        })}`
      );
    } catch (error) {
      console.error('Failed to read clipboard contents: ', error);
    }

    closeOption();
  };

  return (
    <Root>
      {auth.user.id !== author.id && (
        <FollowItem>
          <Follow user={author} />
        </FollowItem>
      )}

      <StyledButton fullWidth text onClick={copyToClipboard}>
        Copy link
      </StyledButton>

      {auth.user.id === author.id && (
        <StyledButton fullWidth text onClick={deletePost}>
          Delete post
        </StyledButton>
      )}

      <StyledButton fullWidth onClick={closeOption} text>
        Cancel
      </StyledButton>
    </Root>
  );
};

PostCardOption.propTypes = {
  postId: PropTypes.string.isRequired,
  author: PropTypes.object.isRequired,
  closeOption: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

export default PostCardOption;
