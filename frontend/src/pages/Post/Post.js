import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { Content } from 'components/Layout';
import PostPopup from 'components/PostPopup';

/**
 * Post detail page
 */
const Post = ({ match }) => {
  return (
    <Content>
      <PostPopup usedInModal={false} id={match.params.id} />
    </Content>
  );
};

Post.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(Post);
