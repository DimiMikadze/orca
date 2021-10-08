import React, { FC } from 'react';
import theme from '../../../theme';
import get from 'lodash/get';

interface ShareIconProps {
  width?: string;
  color?: string;
}

const ShareIcon: FC<ShareIconProps> = ({ width, color }) => {
  const DEFAULT_WIDTH = '18';
  const DEFAULT_COLOR = theme.colors.general.textSecondary;

  return (
    <svg
      width={width || DEFAULT_WIDTH}
      fill={get(theme.colors.general, color) || DEFAULT_COLOR}
      viewBox="0 -22 512 511"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M512 233.82L299.223.5v139.203h-45.239C113.711 139.703 0 253.414 0 393.687v73.77l20.094-22.02a360.573 360.573 0 01266.324-117.5h12.805v139.204zm0 0" />
    </svg>
  );
};

export default ShareIcon;
