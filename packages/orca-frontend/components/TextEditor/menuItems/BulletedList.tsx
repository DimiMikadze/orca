import React, { FC } from 'react';
import { StyledMenuItem } from './style';

interface BulletedListProps {
  width?: string;
  active?: boolean;
}

const BulletedList: FC<BulletedListProps> = ({ width, active }) => {
  const DEFAULT_WIDTH = '20';

  return (
    <StyledMenuItem active={active} width={width || DEFAULT_WIDTH}>
      <path d="M7 5h14v2H7V5m0 8v-2h14v2H7M4 4.5A1.5 1.5 0 0 1 5.5 6A1.5 1.5 0 0 1 4 7.5A1.5 1.5 0 0 1 2.5 6A1.5 1.5 0 0 1 4 4.5m0 6A1.5 1.5 0 0 1 5.5 12A1.5 1.5 0 0 1 4 13.5A1.5 1.5 0 0 1 2.5 12A1.5 1.5 0 0 1 4 10.5M7 19v-2h14v2H7m-3-2.5A1.5 1.5 0 0 1 5.5 18A1.5 1.5 0 0 1 4 19.5A1.5 1.5 0 0 1 2.5 18A1.5 1.5 0 0 1 4 16.5Z" />
    </StyledMenuItem>
  );
};

export default BulletedList;
