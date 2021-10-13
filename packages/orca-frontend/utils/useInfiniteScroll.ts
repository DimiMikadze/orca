import { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';

interface useInfiniteScrollProps {
  key: any;
  apiCall: any;
  dataLimit: number;
  enabled?: boolean;
}

interface useInfiniteScrollReturnType {
  data: any;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  refetch?: any;
}

const useInfiniteScroll = ({
  key,
  dataLimit,
  apiCall,
  enabled = true,
}: useInfiniteScrollProps): useInfiniteScrollReturnType => {
  const { data, fetchNextPage, isFetching, isFetchingNextPage, refetch } = useInfiniteQuery(key, apiCall, {
    getNextPageParam: (lastPage: unknown[], pages) => {
      return lastPage.length > 0 ? pages.length * dataLimit : undefined;
    },
    enabled,
  });

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollTop = document.documentElement.scrollTop;
      const offsetHeight = document.documentElement.offsetHeight;
      const scrolled = windowHeight + scrollTop > offsetHeight - offsetHeight / 3;

      if (data?.pages[data?.pages.length - 1].length === 0) {
        window.removeEventListener('scroll', handleScroll);
        return;
      }

      if (scrolled) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [data, fetchNextPage]);

  return { data, isFetching, isFetchingNextPage, refetch };
};

export default useInfiniteScroll;
