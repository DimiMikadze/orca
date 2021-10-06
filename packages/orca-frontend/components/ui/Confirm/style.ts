import styled from 'styled-components';

export const Root = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  padding: ${(p) => p.theme.spacing.xs};
`;

export const ButtonContainer = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.border.main};
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-top: ${(p) => p.theme.spacing.sm};
`;

export const Title = styled.div`
  margin: 0 ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.lg};
`;
