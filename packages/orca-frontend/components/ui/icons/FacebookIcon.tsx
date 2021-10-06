import React, { FC } from 'react';
import theme from '../../../theme';
import get from 'lodash/get';

interface FacebookIconProps {
  width?: string;
  color?: string;
}

const FacebookIcon: FC<FacebookIconProps> = ({ color, width }) => {
  const DEFAULT_WIDTH = '18';
  const DEFAULT_COLOR = theme.colors.general.textSecondary;

  return (
    <svg
      width={width || DEFAULT_WIDTH}
      fill={get(theme.colors.social, color) || DEFAULT_COLOR}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <path d="M448 0H64C28.704 0 0 28.704 0 64v384c0 35.296 28.704 64 64 64h192V336h-64v-80h64v-64c0-53.024 42.976-96 96-96h64v80h-32c-17.664 0-32-1.664-32 16v64h80l-32 80h-48v176h96c35.296 0 64-28.704 64-64V64c0-35.296-28.704-64-64-64z" />
    </svg>
  );
};

export default FacebookIcon;
