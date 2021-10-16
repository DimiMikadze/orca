import React, { FC } from 'react';
import theme from '../../../theme';
import get from 'lodash/get';

interface DragIconProps {
  width?: string;
  color?: string;
}

const DragIcon: FC<DragIconProps> = ({ width, color }) => {
  const DEFAULT_WIDTH = '12';
  const DEFAULT_COLOR = theme.colors.general.textSecondary;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || DEFAULT_WIDTH}
      viewBox="0 0 24 24"
      fill="none"
      stroke={get(theme.colors.general, color) || DEFAULT_COLOR}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-move"
    >
      <polyline points="5 9 2 12 5 15" />
      <polyline points="9 5 12 2 15 5" />
      <polyline points="15 19 12 22 9 19" />
      <polyline points="19 9 22 12 19 15" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="12" y1="2" x2="12" y2="22" />
    </svg>
  );
};

export default DragIcon;
