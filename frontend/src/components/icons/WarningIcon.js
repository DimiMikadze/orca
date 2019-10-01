import React from 'react';
import theme from 'theme';

/**
 * Post like icon
 *
 * @param {string} width
 * @param {string} color
 */
export const WarningIcon = ({ width, color }) => {
  const DEFAULT_WIDTH = '22';
  const DEFAULT_COLOR = theme.colors.white;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || DEFAULT_WIDTH}
      fill={theme.colors[color] || DEFAULT_COLOR}
      viewBox="0 0 512 512"
    >
      <path d="M256 0C114.497 0 0 114.507 0 256c0 141.503 114.507 256 256 256 141.503 0 256-114.507 256-256C512 114.497 397.493 0 256 0zm0 472c-119.393 0-216-96.615-216-216 0-119.393 96.615-216 216-216 119.393 0 216 96.615 216 216 0 119.393-96.615 216-216 216z" />
      <path d="M256 128.877c-11.046 0-20 8.954-20 20V277.67c0 11.046 8.954 20 20 20s20-8.954 20-20V148.877c0-11.046-8.954-20-20-20z" />
      <circle cx="256" cy="349.16" r="27" />
    </svg>
  );
};
