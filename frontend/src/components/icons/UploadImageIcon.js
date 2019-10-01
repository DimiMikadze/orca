import React from 'react';
import theme from 'theme';

/**
 * Upload image icon
 *
 * @param {string} width
 * @param {string} color
 */
export const UploadImageIcon = ({ width, color }) => {
  const DEFAULT_WIDTH = '20';
  const DEFAULT_COLOR = theme.colors.text.secondary;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={width || DEFAULT_WIDTH}
    >
      <path
        d="M50 40c-8.285 0-15 6.718-15 15 0 8.285 6.715 15 15 15 8.283 0 15-6.715 15-15 0-8.282-6.717-15-15-15zm40-15H78c-1.65 0-3.428-1.28-3.949-2.846l-3.102-9.309C70.426 11.28 68.65 10 67 10H33c-1.65 0-3.428 1.28-3.949 2.846l-3.102 9.309C25.426 23.72 23.65 25 22 25H10C4.5 25 0 29.5 0 35v45c0 5.5 4.5 10 10 10h80c5.5 0 10-4.5 10-10V35c0-5.5-4.5-10-10-10zM50 80c-13.807 0-25-11.193-25-25 0-13.806 11.193-25 25-25 13.805 0 25 11.194 25 25 0 13.807-11.195 25-25 25zm36.5-38.007a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"
        fill={theme.colors[color] || DEFAULT_COLOR}
      />
    </svg>
  );
};
