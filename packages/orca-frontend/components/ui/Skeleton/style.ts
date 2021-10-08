import styled, { keyframes, css } from 'styled-components';
import { Theme } from '../../../theme';
import { SkeletonProps } from './Skeleton';

const blink = (theme: Theme) => keyframes`
    0% {
        background-color: ${theme.colors.grey[10]}
    }

    50% {
        background-color: ${theme.colors.grey[20]}
    }

    100% {
        background-color: ${theme.colors.grey[10]}
    }
  `;

export const Root = styled.div<SkeletonProps>`
  width: ${(p) => (p.width ? `${p.width}px` : '100%')};
  height: ${(p) => p.height && `${p.height}px`};
  display: ${(p) => p.inline && `inline-block`};
  margin-top: ${(p) => p.theme.spacing[p.top]};
  margin-left: ${(p) => p.theme.spacing[p.left]};
  margin-right: ${(p) => p.theme.spacing[p.right]};
  margin-bottom: ${(p) => p.theme.spacing[p.bottom]};
  background-color: ${(p) => p.theme.colors.grey[20]};
  border-radius: ${(p) => (p.radius ? p.theme.radius[p.radius] : p.theme.radius.sm)};
  animation: ${(p) =>
    css`
      ${blink(p.theme)} 1.5s infinite
    `};
`;
