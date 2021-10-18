import styled from 'styled-components';

export const Root = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: ${(p) => p.theme.radius.md};
  padding: ${(p) => p.theme.spacing.xs} ${(p) => p.theme.spacing.sm};
  background-color: ${(p) => p.theme.colors.general.white};
  margin-bottom: ${(p) => p.theme.spacing.sm};
  box-shadow: ${(p) => p.theme.shadows.sm};
`;

export const Container = styled.div`
  border-radius: ${(p) => p.theme.radius.md};
  background-color: ${(p) => p.theme.colors.grey[5]};
  height: 40px;
  margin-left: ${(p) => p.theme.spacing.xs};
  padding-left: ${(p) => p.theme.spacing.xs};
  color: ${(p) => p.theme.colors.general.textSecondary};
  width: 100%;
  line-height: 40px;
  cursor: pointer;
  transition: background-color 0.1s;

  &:hover {
    background-color: ${(p) => p.theme.colors.grey[10]};
  }
`;
