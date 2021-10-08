import React, { FC } from 'react';
import theme from '../../../theme';

interface PeopleColorfulIconProps {
  width?: string;
  color?: string;
}

const PeopleColorfulIcon: FC<PeopleColorfulIconProps> = ({ width }) => {
  const DEFAULT_WIDTH = '22';

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={width || DEFAULT_WIDTH}>
      <path
        d="M438.162 273.162H386.19c-40.719 0-74.067 33.204-74.067 73.923v81.51c0 24.431 20.097 44.444 44.529 44.444H467.7c24.432 0 44.3-20.013 44.3-44.444v-81.51c0-40.72-33.119-73.923-73.838-73.923z"
        fill={theme.colors.general.error}
      />
      <path
        d="M412.176 273.161H386.19c-40.719 0-74.067 33.204-74.067 73.923v81.51c0 24.431 20.097 44.444 44.529 44.444h55.524V273.161z"
        fill={theme.colors.general.error}
      />
      <path
        d="M412.176 121.737c-36.623 0-66.417 29.795-66.417 66.417 0 36.623 29.794 66.418 66.417 66.418s66.417-29.795 66.417-66.418c0-36.621-29.794-66.417-66.417-66.417z"
        fill={theme.colors.general.error}
      />
      <path
        d="M412.176 121.737c-36.623 0-66.417 29.795-66.417 66.417 0 36.623 29.794 66.418 66.417 66.418V121.737z"
        fill={theme.colors.general.error}
      />
      <path
        d="M126.038 273.162H74.067C33.348 273.162 0 306.365 0 347.084v81.51c0 24.431 20.097 44.444 44.529 44.444h111.048c24.432 0 44.3-20.013 44.3-44.444v-81.51c0-40.719-33.119-73.922-73.839-73.922z"
        fill={theme.colors.general.success}
      />
      <path
        d="M100.053 273.161H74.067C33.348 273.161 0 306.365 0 347.084v81.51c0 24.431 20.097 44.444 44.529 44.444h55.524V273.161z"
        fill={theme.colors.general.success}
      />
      <path
        d="M301.222 234.766h-90.444c-40.719 0-73.846 33.127-73.846 73.846v149.521c0 8.157 6.613 14.769 14.769 14.769h208.598c8.157 0 14.769-6.612 14.769-14.769V308.612c0-40.719-33.127-73.846-73.846-73.846z"
        fill={theme.colors.general.primary}
      />
      <path
        d="M256.499 234.766h-45.721c-40.719 0-73.846 33.127-73.846 73.846v149.521c0 8.157 6.613 14.769 14.769 14.769h104.798V234.766z"
        fill={theme.colors.general.primary}
      />
      <path
        d="M256 38.96c-48.97 0-88.81 39.84-88.81 88.81s39.839 88.81 88.81 88.81 88.81-39.84 88.81-88.81S304.97 38.96 256 38.96z"
        fill={theme.colors.general.primary}
      />
      <path
        d="M256 38.96c-48.97 0-88.81 39.84-88.81 88.81s39.839 88.81 88.81 88.81V38.96z"
        fill={theme.colors.general.primary}
      />
      <path
        d="M100.053 121.737c-36.623 0-66.417 29.795-66.417 66.417 0 36.623 29.794 66.418 66.417 66.418s66.417-29.795 66.417-66.418c0-36.621-29.794-66.417-66.417-66.417z"
        fill={theme.colors.general.success}
      />
      <path
        d="M100.053 121.737c-36.623 0-66.417 29.795-66.417 66.417 0 36.623 29.794 66.418 66.417 66.418V121.737z"
        fill={theme.colors.general.success}
      />
    </svg>
  );
};

export default PeopleColorfulIcon;
