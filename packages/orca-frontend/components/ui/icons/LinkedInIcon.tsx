import React, { FC } from 'react';
import theme from '../../../theme';
import get from 'lodash/get';

interface LinkedInIconProps {
  width?: string;
  color?: string;
}

const LinkedIn: FC<LinkedInIconProps> = ({ color, width }) => {
  const DEFAULT_WIDTH = '20';
  const DEFAULT_COLOR = theme.colors.general.textSecondary;

  return (
    <svg
      width={width || DEFAULT_WIDTH}
      fill={get(theme.colors.social, color) || DEFAULT_COLOR}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 504.4 504.4"
    >
      <path d="M377.6.2H126.4C56.8.2 0 57 0 126.6v251.6c0 69.2 56.8 126 126.4 126H378c69.6 0 126.4-56.8 126.4-126.4V126.6C504 57 447.2.2 377.6.2zM168 408.2H96v-208h72v208zm-36.4-240c-20.4 0-36.8-16.4-36.8-36.8s16.4-36.8 36.8-36.8 36.8 16.4 36.8 36.8c-.4 20.4-16.8 36.8-36.8 36.8zm276.8 240H348V307.4c0-24.4-3.2-55.6-36.4-55.6-34 0-39.6 26.4-39.6 54v102.4h-60v-208h56v28h1.6c8.8-16 29.2-28.4 61.2-28.4 66 0 77.6 38 77.6 94.4v114z" />
    </svg>
  );
};

export default LinkedIn;
