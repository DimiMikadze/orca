import React, { FC } from 'react';
import { StyledMenuItem } from './style';

interface TextHeader3Props {
  width?: string;
  active?: boolean;
}

const TextHeader3: FC<TextHeader3Props> = ({ width, active }) => {
  const DEFAULT_WIDTH = '20';

  return (
    <StyledMenuItem active={active} width={width || DEFAULT_WIDTH}>
      <path d="M3 4h2v6h4V4h2v14H9v-6H5v6H3V4m12 0h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1h2v1h4v-4h-4v-2h4V6h-4v1h-2V6a2 2 0 0 1 2-2Z" />
    </StyledMenuItem>
  );
};

export default TextHeader3;
