import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

/**
 * Scrolls to top on route change
 */
const ScrollToTop = ({ children, location: { pathname } }) => {
  useEffect(
    () => {
      window.scrollTo(0, 0);
    },
    [pathname]
  );

  return children || null;
};

export default withRouter(ScrollToTop);
