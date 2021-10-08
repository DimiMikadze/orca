import styled from 'styled-components';
import { SpacingProps } from './Spacing';

export const Root = styled.div<SpacingProps>`
  ${(p) => p.top && `margin-top: ${p.theme.spacing[p.top]}`};
  ${(p) => p.right && `margin-right: ${p.theme.spacing[p.right]}`};
  ${(p) => p.bottom && `margin-bottom: ${p.theme.spacing[p.bottom]}`};
  ${(p) => p.left && `margin-left: ${p.theme.spacing[p.left]}`};
  ${(p) => p.inline && `display: inline-block;`}

  @media (max-width: ${(p) => p.theme.screen.sm}) {
    ${(p) =>
      p.hideOnSm &&
      `
      display: none;
    `}
  }
`;
