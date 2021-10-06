import React, { FC } from 'react';
import theme from '../../../theme';

interface EnvelopeIconProps {
  width?: string;
  color?: string;
}

const EnvelopeIcon: FC<EnvelopeIconProps> = ({ width, color }) => {
  const DEFAULT_WIDTH = '24';
  const DEFAULT_COLOR = theme.colors.general.textSecondary;

  return (
    <svg
      width={width || DEFAULT_WIDTH}
      fill={theme.colors.general[color] || DEFAULT_COLOR}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512.001 512.001"
    >
      <path d="M511.646 126.634c-.021-14.449-11.782-26.189-26.227-26.189h-.034l-459.195.631c-7.005.009-13.588 2.746-18.535 7.706C2.709 113.743-.009 120.334 0 127.337l.355 258.029c.009 7.005 2.746 13.588 7.706 18.535 4.951 4.938 11.526 7.655 18.519 7.655h.035l459.194-.631c14.458-.02 26.207-11.799 26.19-26.261l-.353-258.03zm-55.035.076L256.02 266.154 55.04 127.262l401.571-.552zM340.846 292.471l118.971 92.265-407.972.56 119.696-92.825c5.722-4.439 6.764-12.675 2.326-18.399-4.439-5.722-12.675-6.764-18.399-2.326L26.561 371.715l-.32-232.475 222.344 153.657a13.093 13.093 0 0 0 7.455 2.325c2.617 0 5.236-.783 7.485-2.346l221.912-154.264.336 233.066-128.856-99.931c-5.719-4.437-13.959-3.396-18.397 2.326-4.439 5.722-3.398 13.96 2.326 18.398z" />
    </svg>
  );
};

export default EnvelopeIcon;
