import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import PostPopup from 'components/PostPopup';

/**
 * Post detail page
 */
const Post = ({ match }) => {
  return <PostPopup usedInModal={false} id={match.params.id} />;
};

Post.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(Post);
