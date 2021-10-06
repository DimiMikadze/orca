import React, { FC } from 'react';
import theme from '../../../theme';

interface GoogleIconProps {
  width?: string;
}

const GoogleIcon: FC<GoogleIconProps> = ({ width }) => {
  const DEFAULT_WIDTH = '30';
  const DEFAULT_COLOR = theme.colors.general.textSecondary;

  return (
    <svg
      width={width || DEFAULT_WIDTH}
      fill={theme.colors.general.white || DEFAULT_COLOR}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
    >
      <path d="M16 28c11 0 12-1 12-12S27 4 16 4 4 5 4 16s1 12 12 12zm.142-10.558v-2.675l6.731.01c.588 2.728-.735 8.223-6.731 8.223C12.198 23 9 19.866 9 16s3.198-7 7.142-7a7.2 7.2 0 014.81 1.825l-2.01 1.97a4.339 4.339 0 00-2.8-1.017c-2.379 0-4.308 1.89-4.308 4.222 0 2.332 1.929 4.222 4.308 4.222 1.998 0 3.38-1.159 3.888-2.78h-3.888z" />
    </svg>
  );
};

export default GoogleIcon;
