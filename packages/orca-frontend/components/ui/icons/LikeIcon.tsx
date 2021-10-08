import React, { FC } from 'react';
import theme from '../../../theme';
import get from 'lodash/get';

interface LikeIconProps {
  width?: string;
  color?: string;
}

const LikeIcon: FC<LikeIconProps> = ({ width, color }) => {
  const DEFAULT_WIDTH = '18';
  const DEFAULT_COLOR = theme.colors.general.textSecondary;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || DEFAULT_WIDTH}
      fill={get(theme.colors.general, color) || DEFAULT_COLOR}
      viewBox="0 0 511.999 511.999"
    >
      <path d="M83.578 167.256H16.716C7.524 167.256 0 174.742 0 183.971v300.881c0 9.225 7.491 16.713 16.716 16.713h66.862c9.225 0 16.716-7.489 16.716-16.713V183.971c0-9.229-7.525-16.715-16.716-16.715zM470.266 167.256c-2.692-.456-128.739 0-128.739 0l17.606-48.032c12.148-33.174 4.283-83.827-29.424-101.835-10.975-5.864-26.309-8.809-38.672-5.697-7.09 1.784-13.321 6.478-17.035 12.767-4.271 7.233-3.83 15.676-5.351 23.696-3.857 20.342-13.469 39.683-28.354 54.2-25.952 25.311-106.571 98.331-106.571 98.331v267.45h278.593c37.592.022 62.228-41.958 43.687-74.749 22.101-14.155 29.66-43.97 16.716-66.862 22.102-14.155 29.66-43.97 16.716-66.862 38.134-24.423 25.385-84.871-19.172-92.407z" />
    </svg>
  );
};

export default LikeIcon;
