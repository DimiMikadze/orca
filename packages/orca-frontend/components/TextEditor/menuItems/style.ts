import styled from 'styled-components';

interface StyledMenuItemProps {
  active: boolean;
  width: number;
}

export const StyledMenuItem = styled.svg.attrs((props: StyledMenuItemProps) => ({
  version: '1.1',
  xmlns: 'http://www.w3.org/2000/svg',
  xmlnsXlink: 'http://www.w3.org/1999/xlink',
  viewBox: '0 0 24 24',
  'aria-hidden': true,
  role: 'img',
  preserveAspectRatio: 'xMidYMid meet',
  active: props.active ? props.active : false,
}))`
  width: ${(p) => p.width}px;
  fill: ${(p) => (p.active ? p.theme.colors.general.primary : p.theme.colors.grey[50])};
`;
