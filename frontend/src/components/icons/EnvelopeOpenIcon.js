import React from 'react';
import theme from 'theme';

/**
 * Envelope open (message) icon
 *
 * @param {string} width
 * @param {string} color
 */
export const EnvelopeOpenIcon = ({ width, color }) => {
  const DEFAULT_WIDTH = '23';
  const DEFAULT_COLOR = theme.colors.text.secondary;

  return (
    <svg
      width={width || DEFAULT_WIDTH}
      fill={theme.colors[color] || DEFAULT_COLOR}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <path d="M494.2 488V187c0-3.1-3.9-7-7.7-9.9L407.8 120V56.9c0-6.2-5.2-10.4-10.4-10.4h-89.7L262 13.2c-3.1-2.1-8.3-2.1-11.5 0l-45.7 33.3h-89.7c-6.2 0-10.4 5.2-10.4 10.4v62.4L25 177.2c-4.7 2.9-7.7 6.7-7.7 9.9v303c0 5.9 4.7 10 9.6 10.4h456.8c6.7-.1 10.5-5.3 10.5-12.5zm-19.8-282.3v263.6L302.3 331.5l172.1-125.8zm-7.7-18.3l-58.9 42.9v-86.2l58.9 43.3zM255.8 32.9l18.3 13.5h-36.7l18.4-13.5zM387 67.3v178.2l-131.2 95.6-131.2-95.6V67.3H387zM37.2 205.7l172.1 125.8L37.2 470.1V205.7zm67.6 25.4l-60.4-44 60.4-43.9v87.9zM55.9 480.6L226 343.7l23.5 17.2c4.5 3.4 7.9 3.4 12.5 0l23.5-17.2 171.1 136.9H55.9z" />
      <path d="M186.1 118.3h140.5v19.8H186.1zM186.1 181.8h140.5v19.8H186.1zM186.1 245.3h140.5v19.8H186.1z" />
    </svg>
  );
};
