import React, { FC } from 'react';
import theme from '../../../theme';
import get from 'lodash/get';

interface UnbanIconProps {
  width?: string;
  color?: string;
}

const UnbanIcon: FC<UnbanIconProps> = ({ width, color }) => {
  const DEFAULT_WIDTH = '19';
  const DEFAULT_COLOR = theme.colors.general.textSecondary;

  return (
    <svg
      width={width || DEFAULT_WIDTH}
      fill={get(theme.colors.general, color) || DEFAULT_COLOR}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 486.866 486.866"
    >
      <path d="M393.904 214.852h-8.891v-72.198c0-76.962-61.075-141.253-137.411-142.625a304.936 304.936 0 0 0-8.338 0C162.927 1.4 101.853 65.691 101.853 142.653v1.603c0 16.182 13.118 29.3 29.3 29.3 16.182 0 29.299-13.118 29.299-29.3v-1.603c0-45.845 37.257-83.752 82.98-83.752s82.981 37.907 82.981 83.752v72.198H92.963c-13.702 0-24.878 14.139-24.878 31.602v208.701c0 17.44 11.176 31.712 24.878 31.712h300.941c13.703 0 24.878-14.271 24.878-31.712V246.452c.001-17.463-11.175-31.6-24.878-31.6zM271.627 350.591v63.062c0 7.222-6.046 13.332-13.273 13.332h-29.841c-7.228 0-13.273-6.11-13.273-13.332v-63.062c-7.009-6.9-11.09-16.44-11.09-26.993 0-19.999 15.459-37.185 35.115-37.977 2.083-.085 6.255-.085 8.337 0 19.656.792 35.115 17.978 35.115 37.977 0 10.551-4.08 20.092-11.09 26.993z" />
    </svg>
  );
};

export default UnbanIcon;
