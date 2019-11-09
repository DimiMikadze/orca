import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Spacing } from 'components/Layout';
import Like from 'components/Like';
import { PostCommentIcon } from 'components/icons';

const Root = styled.div`
  border-top: 1px solid ${p => p.theme.colors.border.main};
  border-bottom: 1px solid ${p => p.theme.colors.border.main};
  padding-bottom: ${p => p.theme.spacing.xs};
`;

const Icons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: ${p => p.theme.spacing.sm};
`;

const Count = styled.div`
  font-size: ${p => p.theme.font.size.xxs};
  padding-left: ${p => p.theme.spacing.sm};
`;

/**
 * Options for PostPopup component
 */
const PostPopupOptions = ({ postId, postAuthor, postLikes }) => {
  return (
    <Root>
      <Icons>
        <Like postId={postId} user={postAuthor} likes={postLikes} />
        <Spacing right="sm" />
        <PostCommentIcon />
      </Icons>

      <Count>{postLikes.length} likes</Count>
    </Root>
  );
};

PostPopupOptions.propTypes = {
  postId: PropTypes.string.isRequired,
  postAuthor: PropTypes.object.isRequired,
  postLikes: PropTypes.array.isRequired,
};

export default PostPopupOptions;
