import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { SearchIcon } from 'components/icons';

const Root = styled.div`
  width: 100%;
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
  border-radius: ${p => p.theme.radius.md};
  padding-left: ${p => (p.hideIcon ? p.theme.spacing.xs : p.theme.spacing.lg)};
  padding-right: ${p => p.theme.spacing.lg};
  color: ${p => p.theme.colors.text.main};
  font-size: ${p => p.theme.font.size.xs};
  background-color: ${p =>
    p.backgroundColor
      ? p.theme.colors[p.backgroundColor]
      : p.theme.colors.grey[200]};
  transition: border-color 0.1s;

  &:focus {
    &::placeholder {
      color: ${p => p.theme.colors.grey[500]};
    }
  }
`;

/**
 * Component for rendering search input
 */
const SearchInput = ({
  onChange,
  onFocus,
  value,
  inputRef,
  backgroundColor,
  placeholder,
  hideIcon,
  children,
  autoFocus,
}) => {
  return (
    <Root>
      {!hideIcon && (
        <IconContainer>
          <SearchIcon />
        </IconContainer>
      )}

      <Input
        onChange={onChange}
        onFocus={onFocus}
        value={value}
        ref={inputRef}
        backgroundColor={backgroundColor}
        type="text"
        placeholder={placeholder}
        hideIcon={hideIcon}
        autoFocus={autoFocus}
      />

      {children}
    </Root>
  );
};

SearchInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  value: PropTypes.string.isRequired,
  ref: PropTypes.object,
  backgroundColor: PropTypes.string,
  placeholder: PropTypes.string,
  hideIcon: PropTypes.bool,
  children: PropTypes.node,
  autoFocus: PropTypes.bool,
};

export default SearchInput;
