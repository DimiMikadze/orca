import React, { FC } from 'react';
import { lighten } from 'polished';
import theme from '../../../theme';

interface ShieldColorfulIconProps {
  width?: string;
  color?: string;
}

const ShieldColorfulIcon: FC<ShieldColorfulIconProps> = ({ width }) => {
  const DEFAULT_WIDTH = '22';

  return (
    <svg width={width || DEFAULT_WIDTH} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 485 485">
      <path
        d="M445.9 88.2v135.5c0 123.4-83.8 231-203.5 261.3C122.9 454.8 39.1 347.1 39.1 223.7V88.2C133.2 77.6 186.5 41.8 242.5 0c56 41.8 109.3 77.6 203.4 88.2z"
        fill={lighten(0.2, theme.colors.general.primary)}
      />
      <path
        d="M242.5 431.5c-90.1-28.6-152-112.2-152-207.8v-91.8c63.3-13.8 109.8-39.3 152-68.4 43.1 29.9 88.7 54.9 152 68.5v91.8c0 95.5-61.9 179.1-152 207.7z"
        fill={theme.colors.general.primary}
      />
      <path fill={theme.colors.general.white} d="M208.8 325.4l-50.1-50.1 25.4-25.5 24.7 24.6 92.1-92 25.4 25.4z" />
    </svg>
  );
};

export default ShieldColorfulIcon;
