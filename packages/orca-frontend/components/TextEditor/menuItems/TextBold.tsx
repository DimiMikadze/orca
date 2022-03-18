import React, { FC } from 'react';
import { StyledMenuItem } from './style';

interface TextBoldProps {
  width?: string;
  active?: boolean;
}

const TextBold: FC<TextBoldProps> = ({ width, active }) => {
  const DEFAULT_WIDTH = '20';

  return (
    <StyledMenuItem active={active} width={width || DEFAULT_WIDTH}>
      <path d="M13.5 15.5H10v-3h3.5A1.5 1.5 0 0 1 15 14a1.5 1.5 0 0 1-1.5 1.5m-3.5-9h3A1.5 1.5 0 0 1 14.5 8A1.5 1.5 0 0 1 13 9.5h-3m5.6 1.29c.97-.68 1.65-1.79 1.65-2.79c0-2.26-1.75-4-4-4H7v14h7.04c2.1 0 3.71-1.7 3.71-3.79c0-1.52-.86-2.82-2.15-3.42Z" />
    </StyledMenuItem>
  );
};

export default TextBold;
