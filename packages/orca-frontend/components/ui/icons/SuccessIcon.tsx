import React, { FC } from 'react';
import theme from '../../../theme';

interface SuccessIconProps {
  width?: string;
  color?: string;
}

const SuccessIcon: FC<SuccessIconProps> = ({ width, color }) => {
  const DEFAULT_WIDTH = '24';
  const DEFAULT_COLOR = theme.colors.general.success;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={width || DEFAULT_WIDTH}>
      <ellipse cx="256" cy="256" rx="256" ry="255.832" fill={theme.colors.general[color] || DEFAULT_COLOR} />
      <path fill="#fff" d="M235.472 392.08l-121.04-94.296 34.416-44.168 74.328 57.904 122.672-177.016 46.032 31.888z" />
    </svg>
  );
};

export default SuccessIcon;
