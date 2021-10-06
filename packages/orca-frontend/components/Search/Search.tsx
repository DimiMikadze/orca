import { FC, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { Root, IconContainer, Input } from './style';
import { SearchIcon } from '../ui/icons';
import SearchResult from './SearchResult';
import axios from 'axios';
import { useClickOutside } from '../../utils';
import { Radius } from '../../theme';
export interface InputProps {
  hideIcon?: boolean;
  backgroundColor?: number;
  placeholder?: string;
  hideBorder?: boolean;
  radius?: Radius;
  onlyUsers?: boolean;
  onItemClick: (user: any) => void;
}

const search = async ({ queryKey }) => {
  const [, onlyUsers, searchQuery] = queryKey;
  const endpoint = onlyUsers ? `/search/users/${searchQuery}` : `/search/all/${searchQuery}`;
  const { data } = await axios.get(endpoint);
  return data;
};

const Search: FC<InputProps> = ({
  onlyUsers,
  hideIcon,
  hideBorder,
  radius,
  backgroundColor,
  placeholder,
  onItemClick,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, isDropdownOpen, () => {
    if (isDropdownOpen) {
      setSearchQuery('');
      setIsDropdownOpen(false);
    }
  });
  const { data, isFetching } = useQuery(['search', onlyUsers, searchQuery], search, {
    enabled: searchQuery !== '',
  });

  useEffect(() => {
    if (searchQuery.trim().length > 0 && !isDropdownOpen) {
      setIsDropdownOpen(true);
    }

    if (searchQuery.trim().length === 0 && isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  }, [searchQuery, isDropdownOpen]);

  return (
    <Root ref={dropdownRef}>
      {!hideIcon && (
        <IconContainer>
          <SearchIcon />
        </IconContainer>
      )}

      <Input
        backgroundColor={backgroundColor}
        type="text"
        placeholder={placeholder}
        hideIcon={hideIcon}
        hideBorder={hideBorder}
        radius={radius}
        isDropdownOpen={isDropdownOpen}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {isDropdownOpen && (
        <SearchResult
          onlyUsers={onlyUsers}
          setIsDropdownOpen={setIsDropdownOpen}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          items={data}
          onItemClick={onItemClick}
          isFetching={isFetching}
        />
      )}
    </Root>
  );
};

export default Search;
