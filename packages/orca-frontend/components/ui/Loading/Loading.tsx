import styled, { keyframes } from 'styled-components';
import { FontSize, Spacing } from '../../../theme';

// prettier-ignore

const Load = keyframes`
  0% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
  5%,
  95% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
  10%,
  59% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em, -0.173em -0.812em 0 -0.44em, -0.256em -0.789em 0 -0.46em, -0.297em -0.775em 0 -0.477em;
  }
  20% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em, -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em, -0.749em -0.34em 0 -0.477em;
  }
  38% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em, -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em, -0.82em -0.09em 0 -0.477em;
  }
  100% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
`;

const Round = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

interface LoadingProps {
  top?: Spacing;
  bottom?: Spacing;
  size?: FontSize;
}

export const Loading = styled.div<LoadingProps>`
  text-indent: -9999em;
  overflow: hidden;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  position: relative;
  transform: translateZ(0);
  animation: ${Load} 1.7s infinite ease, ${Round} 1.7s infinite ease;
  margin: 0 auto;
  margin-top: ${(p) => p.top && p.theme.spacing[p.top]};
  margin-bottom: ${(p) => p.bottom && p.theme.spacing[p.bottom]};
  color: ${(p) => (p.color ? p.theme.colors[p.color] : p.theme.colors.general.textSecondary)};
  font-size: ${(p) => (p.size ? p.theme.font.size[p.size] : p.theme.font.size.sm)};
`;

export const LoadingDots = styled.div`
  &::after {
    display: block;
    animation: ellipsis 1s infinite;
    content: '.';
    text-align: center;
    color: ${(p) => (p.color ? p.theme.colors.general[p.color] : p.theme.colors.general.textSecondary)};
    font-size: ${(p) => p.theme.font.size.xl};
  }

  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`;
