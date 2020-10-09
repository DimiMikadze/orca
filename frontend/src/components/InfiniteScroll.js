import { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { get, uniqBy, setWith, clone } from 'lodash';

/**
 * Component that adds Infinite scroll functionality to UI
 */
const InfiniteScroll = ({ data, dataKey, fetchMore, variables, count, children }) => {
  const handleScroll = useMemo(
    () => async () => {
      const loadMore = () => {
        return fetchMore({
          variables: { ...variables, skip: data.length },
          updateQuery: (prev, { fetchMoreResult }) => {
            const previousData = get(prev, dataKey);
            const fetchMoreData = get(fetchMoreResult, dataKey);
            return setWith(clone(prev), dataKey, uniqBy([...previousData, ...fetchMoreData], 'id'), clone);
          },
        });
      };

      const windowHeight = window.innerHeight;
      const scrollTop = document.documentElement.scrollTop;
      const offsetHeight = document.documentElement.offsetHeight;
      const scrolled = windowHeight + scrollTop > offsetHeight - offsetHeight / 3;

      // Stop event listener if all the data has been loaded
      if (data.length >= count) {
        window.removeEventListener('scroll', handleScroll);
        return;
      }

      // Load more data if user has scrolled to bottom and if there's still data in db to display
      if (scrolled) {
        window.removeEventListener('scroll', handleScroll);
        loadMore();
      }
    },
    [count, data.length, dataKey, fetchMore, variables]
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return children(data);
};

InfiniteScroll.propTypes = {
  data: PropTypes.array.isRequired,
  dataKey: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  fetchMore: PropTypes.func.isRequired,
  variables: PropTypes.object.isRequired,
  children: PropTypes.func.isRequired,
};

export default InfiniteScroll;
