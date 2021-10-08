import styled from 'styled-components';

export const Heading = styled.div`
  text-align: center;
  margin-bottom: ${(p) => p.theme.spacing.md};
  padding-bottom: ${(p) => p.theme.spacing.sm};
  border-bottom: 1px solid ${(p) => p.theme.colors.border.main};
`;

export const LabelAndToggle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const ButtonContainer = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.border.main};
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-top: ${(p) => p.theme.spacing.sm};
`;
