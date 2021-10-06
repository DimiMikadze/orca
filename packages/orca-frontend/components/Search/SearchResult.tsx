import { FC } from 'react';
import { Result, Item, NoSearchResult, SearchIcon, SearchedText, SearchType } from './style';
import { Avatar } from '../ui';
import { PostIcon } from '../ui/icons';
import { Loading } from '../ui/Loading';

interface SearchResultProps {
  onlyUsers?: boolean;
  items: any[];
  searchQuery?: string;
  onItemClick: (item: any) => void;
  setSearchQuery: (searchQuery: string) => void;
  setIsDropdownOpen: (isDropdownOpen: boolean) => void;
  isFetching?: boolean;
}

const SearchResult: FC<SearchResultProps> = ({
  searchQuery,
  onlyUsers,
  items,
  onItemClick,
  setSearchQuery,
  setIsDropdownOpen,
  isFetching,
}) => {
  const updateText = (text: string, keyword: string) => {
    const regex = new RegExp(keyword.trim(), 'i');
    const chunks = text.split(/[.?!]/).filter((n) => regex.test(n));

    if (chunks.length <= 0) {
      return;
    }

    const result = chunks[0]
      .toLocaleLowerCase()
      .replace(new RegExp(`${keyword.toLocaleLowerCase()}`, 'g'), `<b>${keyword}</b>`);
    return result + '...';
  };

  if ((!isFetching && !items) || (!isFetching && items && items.length === 0)) {
    return (
      <Result>
        <NoSearchResult>No search results.</NoSearchResult>
      </Result>
    );
  }

  return (
    <Result>
      {isFetching ? (
        <Loading bottom="sm" top="sm" />
      ) : (
        items &&
        items.map((item) => {
          const isUserResult = !!item.fullName;

          return (
            <Item
              key={item._id}
              onClick={() => {
                setSearchQuery('');
                setIsDropdownOpen(false);
                onItemClick(item);
              }}
            >
              {!onlyUsers && (
                <SearchIcon>
                  {isUserResult ? <Avatar image={item.image} size={0.8} /> : <PostIcon width="16" />}
                </SearchIcon>
              )}
              <>
                {isUserResult ? (
                  <SearchedText>{item.fullName}</SearchedText>
                ) : (
                  <SearchedText dangerouslySetInnerHTML={{ __html: updateText(item.title, searchQuery) }} />
                )}
              </>
              {!onlyUsers && <SearchType>{isUserResult ? 'User' : 'Post'}</SearchType>}
            </Item>
          );
        })
      )}
    </Result>
  );
};

export default SearchResult;
