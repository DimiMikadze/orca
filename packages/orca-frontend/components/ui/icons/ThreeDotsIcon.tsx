import React, { FC } from 'react';
import theme from '../../../theme';

interface ThreeDotsIconProps {
  width?: string;
  color?: string;
}

const ThreeDotsIcon: FC<ThreeDotsIconProps> = ({ width, color }) => {
  const DEFAULT_WIDTH = '12';
  const DEFAULT_COLOR = theme.colors.general.textSecondary;

  return (
    <svg
      width={width || DEFAULT_WIDTH}
      fill={theme.colors[color] || DEFAULT_COLOR}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 426.667 426.667"
    >
      <circle cx="42.667" cy="213.333" r="42.667" />
      <circle cx="213.333" cy="213.333" r="42.667" />
      <circle cx="384" cy="213.333" r="42.667" />
    </svg>
  );
};

export default ThreeDotsIcon;
