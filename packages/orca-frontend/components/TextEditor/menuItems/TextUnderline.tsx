import React, { FC } from 'react';
import { StyledMenuItem } from './style';

interface TextUnderlineProps {
  width?: string;
  active?: boolean;
}

const TextUnderline: FC<TextUnderlineProps> = ({ width, active }) => {
  const DEFAULT_WIDTH = '20';

  return (
    <StyledMenuItem active={active} width={width || DEFAULT_WIDTH}>
      <path d="M5 21h14v-2H5v2m7-4a6 6 0 0 0 6-6V3h-2.5v8a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 8.5 11V3H6v8a6 6 0 0 0 6 6Z" />
    </StyledMenuItem>
  );
};

export default TextUnderline;
