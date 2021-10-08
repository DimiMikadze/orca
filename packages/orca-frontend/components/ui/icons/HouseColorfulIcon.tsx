import React, { FC } from 'react';
import theme from '../../../theme';

interface HouseColorfulIconProps {
  width?: string;
  color?: string;
}

const HouseColorfulIcon: FC<HouseColorfulIconProps> = ({ width }) => {
  const DEFAULT_WIDTH = '22';

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={width || DEFAULT_WIDTH}>
      <path fill={theme.colors.general.error} d="M382.933 73.6H441.6V176h-58.667z" />
      <path fill={theme.colors.general.error} d="M360.533 21.333H464V76.8H360.533z" />
      <path
        d="M44.8 276.267V512h418.133V276.267L253.866 67.2C172.8 149.333 126.933 195.2 44.8 276.267z"
        fill={theme.colors.general.warning}
      />
      <path
        d="M464 276.267L254.933 67.2c-41.6 40.533-73.6 72.533-105.6 104.533L44.8 276.266v48l209.067-209.067 209.067 209.067v6.4-54.4H464z"
        fill={theme.colors.general.warning}
      />
      <path
        d="M216.533 512H90.667V388.267c0-35.2 28.8-62.933 62.933-62.933 35.2 0 62.933 28.8 62.933 62.933V512z"
        fill={theme.colors.general.warning}
      />
      <path fill={theme.colors.grey[60]} d="M253.867 325.333h164.267v144H253.867z" />
      <g fill={theme.colors.grey[30]}>
        <path d="M270.933 342.4h56.533v109.867h-56.533zM344.533 342.4h56.533v109.867h-56.533z" />
      </g>
      <path
        d="M502.4 232.533L279.467 9.6c-12.8-12.8-35.2-12.8-48 0L9.6 232.533c-12.8 12.8-12.8 35.2 0 48 12.8 12.8 35.2 12.8 48 0L256 82.133l198.4 198.4c12.8 12.8 35.2 12.8 48 0 12.8-13.866 12.8-35.2 0-48z"
        fill={theme.colors.general.error}
      />
    </svg>
  );
};

export default HouseColorfulIcon;
