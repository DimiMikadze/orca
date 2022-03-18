import React, { FC } from 'react';
import { StyledMenuItem } from './style';

interface TextBlockQuoteProps {
  width?: string;
  active?: boolean;
}

const TextBlockQuote: FC<TextBlockQuoteProps> = ({ width, active }) => {
  const DEFAULT_WIDTH = '20';

  return (
    <StyledMenuItem active={active} width={width || DEFAULT_WIDTH}>
      <path d="m10 7l-2 4h3v6H5v-6l2-4h3m8 0l-2 4h3v6h-6v-6l2-4h3Z" />
    </StyledMenuItem>
  );
};

export default TextBlockQuote;
