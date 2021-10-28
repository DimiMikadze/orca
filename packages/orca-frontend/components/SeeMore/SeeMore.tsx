import React, { SyntheticEvent, useState, FC } from 'react';
import { StyledButton } from './style';

const MAX_CHARACTERS_TO_SHOW = 420;

interface SeeMoreProps {
  children: string;
  maxCharactersToShow?: number;
}

const SeeMore: FC<SeeMoreProps> = ({ children, maxCharactersToShow = MAX_CHARACTERS_TO_SHOW }) => {
  const text = children;
  const [isCollapsed, setIsCollapsed] = useState(text.length > maxCharactersToShow);

  const expandTitle = (e: SyntheticEvent) => {
    e.preventDefault();
    setIsCollapsed(!isCollapsed);
  };

  return (
    <span>
      {isCollapsed ? `${text.slice(0, maxCharactersToShow)}...` : text}
      {isCollapsed && (
        <StyledButton ghost onClick={expandTitle}>
          See more
        </StyledButton>
      )}
    </span>
  );
};

export default SeeMore;
