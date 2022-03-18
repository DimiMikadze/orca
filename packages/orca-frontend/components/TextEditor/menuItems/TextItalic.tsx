import React, { FC } from 'react';
import { StyledMenuItem } from './style';

interface TextItalicProps {
  width?: string;
  active?: boolean;
}

const TextItalic: FC<TextItalicProps> = ({ width, active }) => {
  const DEFAULT_WIDTH = '20';

  return (
    <StyledMenuItem active={active} width={width || DEFAULT_WIDTH}>
      <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8Z" />
    </StyledMenuItem>
  );
};

export default TextItalic;
