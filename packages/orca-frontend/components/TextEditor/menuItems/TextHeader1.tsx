import React, { FC } from 'react';
import { StyledMenuItem } from './style';

interface TextHeader1Props {
  width?: string;
  active?: boolean;
}

const TextHeader1: FC<TextHeader1Props> = ({ width, active }) => {
  const DEFAULT_WIDTH = '20';

  return (
    <StyledMenuItem active={active} width={width || DEFAULT_WIDTH}>
      <path d="M3 4h2v6h4V4h2v14H9v-6H5v6H3V4m11 14v-2h2V6.31l-2.5 1.44V5.44L16 4h2v12h2v2h-6Z" />
    </StyledMenuItem>
  );
};

export default TextHeader1;
