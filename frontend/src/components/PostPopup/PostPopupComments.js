import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Comment from 'components/Comment';
import { Spacing } from 'components/Layout';

const Root = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  padding-bottom: ${(p) => p.theme.spacing.sm};

  @media (min-width: ${(p) => p.theme.screen.md}) {
    max-height: 400px;
  }
`;

const Comments = styled.div`
  max-height: ${(p) => (p.usedInModal ? '100%' : '350px')};
  width: 100%;
  overflow-y: scroll;
  box-sizing: content-box;
  padding: 0 ${(p) => p.theme.spacing.xs};
`;

/**
 * Comments for PostPopup component
 */
const PostPopupComments = ({ comments, postId, postAuthor, usedInModal }) => (
  <Root usedInModal={usedInModal}>
    <Spacing top="xs" />

    <Comments usedInModal={usedInModal}>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} postId={postId} postAuthor={postAuthor} />
      ))}
    </Comments>
  </Root>
);

PostPopupComments.propTypes = {
  comments: PropTypes.array.isRequired,
  postId: PropTypes.string.isRequired,
  postAuthor: PropTypes.object.isRequired,
};

export default PostPopupComments;
