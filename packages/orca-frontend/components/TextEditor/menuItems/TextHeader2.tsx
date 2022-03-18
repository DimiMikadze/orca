import React, { FC } from 'react';
import { StyledMenuItem } from './style';

interface TextHeader2Props {
  width?: string;
  active?: boolean;
}

const TextHeader2: FC<TextHeader2Props> = ({ width, active }) => {
  const DEFAULT_WIDTH = '20';

  return (
    <StyledMenuItem active={active} width={width || DEFAULT_WIDTH}>
      <path d="M3 4h2v6h4V4h2v14H9v-6H5v6H3V4m18 14h-6a2 2 0 0 1-2-2c0-.53.2-1 .54-1.36l4.87-5.23c.37-.36.59-.86.59-1.41a2 2 0 0 0-2-2a2 2 0 0 0-2 2h-2a4 4 0 0 1 4-4a4 4 0 0 1 4 4c0 1.1-.45 2.1-1.17 2.83L15 16h6v2Z" />
    </StyledMenuItem>
  );
};

export default TextHeader2;
