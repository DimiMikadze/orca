import styled from 'styled-components';

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${(p) => p.theme.spacing.lg};
  padding: 0 ${(p) => p.theme.spacing.sm};
  text-align: center;
`;
