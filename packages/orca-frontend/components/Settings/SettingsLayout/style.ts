import styled from 'styled-components';

export const Root = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  margin: 0 auto;
  width: 100%;
  position: relative;

  @media (min-width: ${(p) => parseInt(p.theme.screen.lg, 10) + 20 + 'px'}) {
    max-width: ${(p) => p.theme.screen.lg};
  }

  @media (min-width: ${(p) => parseInt(p.theme.screen.xl, 10) + 20 + 'px'}) {
    max-width: ${(p) => p.theme.screen.xl};
  }
`;

export const Container = styled.div`
  width: 100%;
  border: 1px solid ${(p) => p.theme.colors.border.main};
  border-top: 0;
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.sm};
  padding-bottom: ${(p) => p.theme.spacing.lg};
  background-color: ${(p) => p.theme.colors.general.white};
`;
