import styled from 'styled-components';
import { Container } from '../ui';

export const Root = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: start;
  margin: 0 auto;
  width: 100%;
  position: relative;

  @media (min-width: ${(p) => p.theme.screen.xxxl}) {
    max-width: ${(p) => p.theme.screen.xxl};
  }

  /* @media (min-width: ${(p) => parseInt(p.theme.screen.lg, 10) + 20 + 'px'}) {
    max-width: ${(p) => p.theme.screen.lg};
  }

  @media (min-width: ${(p) => parseInt(p.theme.screen.xl, 10) + 20 + 'px'}) {
    max-width: ${(p) => p.theme.screen.xl};
  } */
`;

interface StyledContainerProps {
  hideRightSidebar?: boolean;
}

export const StyledContainer = styled(Container)<StyledContainerProps>`
  @media (min-width: ${(p) => parseInt(p.theme.screen.md, 10) + 20 + 'px'}) {
    max-width: ${(p) => p.theme.screen.xs};
  }

  @media (min-width: ${(p) => parseInt(p.theme.screen.xl, 10) + 20 + 'px'}) {
    max-width: ${(p) => p.theme.screen.sm};
  }

  ${(p) => p.hideRightSidebar && `max-width: 100% !important;`};
`;
