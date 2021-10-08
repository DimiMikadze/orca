import styled from 'styled-components';

export const Root = styled.div`
  position: relative;
  top: ${(p) => p.theme.spacing.sm};
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${(p) => p.theme.zIndex.xl};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  @media (min-width: ${(p) => p.theme.screen.md}) {
    align-items: center;
    top: 0;
  }
`;

interface HeadingProps {
  hideTitleBorder?: boolean;
}

export const Heading = styled.div<HeadingProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding-bottom: ${(p) => p.theme.spacing.sm};
  margin-bottom: ${(p) => p.theme.spacing.xs};
  border-bottom: ${(p) => (p.hideTitleBorder ? 'none' : `1px solid ${p.theme.colors.border.main}`)};
`;
