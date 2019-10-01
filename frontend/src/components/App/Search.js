import React, { useState, useEffect } from 'react';
import { useApolloClient } from 'react-apollo-hooks';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Loading } from 'components/Loading';
import { SearchIcon } from 'components/icons';
import SearchResult from './SearchResult';

import { useClickOutside } from 'hooks/useClickOutside';
import { useDebounce } from 'hooks/useDebounce';

import { SEARCH_USERS } from 'graphql/user';

const Root = styled.div`
  max-width: 280px;
  position: relative;
  z-index: ${p => p.theme.zIndex.xl};
`;

const IconContainer = styled.div`
  position: absolute;
  top: 12px;
  left: 10px;
`;

const Input = styled.input`
  outline: 0;
  height: 40px;
  width: 100%;
  border: 0;
  border-radius: ${p => p.theme.radius.sm};
  padding-left: ${p => p.theme.spacing.lg};
  padding-right: ${p => p.theme.spacing.lg};
  color: ${p => p.theme.colors.text.main};
  font-size: ${p => p.theme.font.size.xs};
  background-color: ${p => p.theme.colors.grey[200]};
  transition: border-color 0.1s;

  &:focus {
    &::placeholder {
      color: ${p => p.theme.colors.grey[500]};
    }
  }
`;

const StyledLoading = styled(Loading)`
  position: absolute;
  top: 14px;
  right: 16px;
`;

/**
 * Renders search input, meant to be used in Header component
 */
const Search = ({ location }) => {
  const client = useApolloClient();

  const [isOpenSearchResult, setIsOpenSearchResult] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Close search result on click outside
  const inputRef = React.useRef(null);
  useClickOutside(inputRef, () => setIsOpenSearchResult(false));

  // Debounce search query value
  const debounceSearchQuery = useDebounce(searchQuery, 500);

  useEffect(
    () => {
      // Clear search input value, after location change
      setSearchQuery('');
    },
    [location.pathname]
  );

  useEffect(
    () => {
      const search = async () => {
        const { data } = await client.query({
          query: SEARCH_USERS,
          variables: { searchQuery: debounceSearchQuery },
        });

        setUsers(data.searchUsers);
        setLoading(false);

        const openSearchResult = debounceSearchQuery !== '';
        setIsOpenSearchResult(openSearchResult);
      };

      debounceSearchQuery ? search() : setIsOpenSearchResult(false);

      return () => setLoading(false);
    },
    [debounceSearchQuery, client]
  );

  const handleInputChange = async e => {
    // Trim white space only from beginning
    const value = e.target.value.replace(/^\s+/g, '');
    setSearchQuery(value);
    if (value) {
      setLoading(true);
    }
  };

  const handleInputFocus = () => searchQuery && setIsOpenSearchResult(true);

  return (
    <Root>
      <IconContainer>
        <SearchIcon />
      </IconContainer>

      <Input
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        value={searchQuery}
        ref={inputRef}
        type="text"
        placeholder="Search People"
      />

      {loading && <StyledLoading size="xxs" />}

      {isOpenSearchResult && <SearchResult users={users} />}
    </Root>
  );
};

Search.propTypes = {
  location: PropTypes.object.isRequired,
};

export default Search;
