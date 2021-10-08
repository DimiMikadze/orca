import React, { FC } from 'react';
import theme from '../../../theme';
import get from 'lodash/get';

interface BanIcon {
  width?: string;
  color?: string;
}

const BanIcon: FC<BanIcon> = ({ width, color }) => {
  const DEFAULT_WIDTH = '18';
  const DEFAULT_COLOR = theme.colors.general.textSecondary;

  return (
    <svg
      width={width || DEFAULT_WIDTH}
      fill={get(theme.colors.general, color) || DEFAULT_COLOR}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 289.658 289.658"
    >
      <path d="M245.758 128.041h-14.217V86.712C231.541 38.899 192.642 0 144.829 0S58.117 38.899 58.117 86.712v41.329H43.9c-8.285 0-15.001 6.716-15.001 15.001v131.613c0 8.285 6.716 15.002 15.001 15.002h201.858c8.285 0 15.002-6.716 15.002-15.002V143.043c0-8.285-6.717-15.002-15.002-15.002zM94.537 86.712c0-27.731 22.561-50.292 50.292-50.292s50.292 22.561 50.292 50.292v41.329H94.537V86.712zm66.64 127.127v26.904c0 9.029-7.319 16.348-16.348 16.348s-16.348-7.319-16.348-16.348v-26.904c-6.081-4.824-9.986-12.272-9.986-20.638 0-14.544 11.79-26.335 26.334-26.335s26.334 11.791 26.334 26.335c0 8.366-3.905 15.815-9.986 20.638z" />
    </svg>
  );
};

export default BanIcon;
