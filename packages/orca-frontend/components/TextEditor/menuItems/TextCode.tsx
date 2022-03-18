import React, { FC } from 'react';
import { StyledMenuItem } from './style';

interface TextCodeProps {
  width?: string;
  active?: boolean;
}

const TextCode: FC<TextCodeProps> = ({ width, active }) => {
  const DEFAULT_WIDTH = '20';

  return (
    <StyledMenuItem active={active} width={width || DEFAULT_WIDTH}>
      <path d="m12.89 3l1.96.4L11.11 21l-1.96-.4L12.89 3m6.7 9L16 8.41V5.58L22.42 12L16 18.41v-2.83L19.59 12M1.58 12L8 5.58v2.83L4.41 12L8 15.58v2.83L1.58 12Z" />
    </StyledMenuItem>
  );
};

export default TextCode;
