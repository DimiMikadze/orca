import React, { FC } from 'react';
import theme from '../../../theme';
import get from 'lodash/get';

interface EndCallIconProps {
  width?: string;
  color?: string;
}

const EndCallIcon: FC<EndCallIconProps> = ({ width, color }) => {
  const DEFAULT_WIDTH = '30';
  const DEFAULT_COLOR = theme.colors.general.white;

  return (
    <svg
      width={width || DEFAULT_WIDTH}
      fill={get(theme.colors.general, color) || DEFAULT_COLOR}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <path d="M502.72 253.163c-66.944-63.445-154.581-98.389-246.72-98.389S76.224 189.717 9.067 253.355C3.2 259.2 0 267.029 0 275.413c0 8.448 3.371 16.491 9.067 21.845l50.688 50.709c11.712 11.669 32.747 11.328 43.627.491 15.851-14.677 33.323-26.816 51.776-36.053 11.435-5.525 15.509-19.051 15.509-29.845v-56.021c27.2-7.317 58.133-7.979 85.333-7.979 28.821 0 58.965.661 85.333 7.915v56.085c0 14.165 5.717 25.387 15.189 29.995 19.285 9.643 36.821 21.76 52.032 36.032 5.803 5.483 13.696 8.64 21.632 8.64 8.384 0 16.213-3.2 22.059-9.045l50.688-50.688c5.845-5.845 9.067-13.675 9.067-22.08 0-8.385-3.2-16.214-9.28-22.251z" />
    </svg>
  );
};

export default EndCallIcon;
