import styled from 'styled-components';
import { Button } from '../../ui';

export const Root = styled.div`
  overflow-y: hidden;
`;

export const Top = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 ${(p) => p.theme.spacing.xs};
  margin: ${(p) => p.theme.spacing.lg} 0;
`;

export const Title = styled.div`
  color: ${(p) => p.theme.colors.general.textSecondary};
`;

export const Count = styled.div`
  margin-top: ${(p) => p.theme.spacing.xs};
  color: ${(p) => p.theme.colors.general.primary};
  font-weight: ${(p) => p.theme.font.weight.bold};
  font-size: ${(p) => p.theme.font.size.xl};
`;

export const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  border: 1px solid ${(p) => p.theme.colors.border.main};
  border-radius: ${(p) => p.theme.radius.sm};
`;

export const Th = styled.th`
  padding: ${(p) => p.theme.spacing.sm};
  text-align: left;
`;

export const StyledButton = styled(Button)`
  visibility: hidden;
  position: absolute;
  top: ${(p) => p.theme.spacing.sm};
  right: ${(p) => p.theme.spacing.sm};
`;

export const Tr = styled.tr`
  position: relative;
  border-top: 1px solid ${(p) => p.theme.colors.border.main};
  border-bottom: 1px solid ${(p) => p.theme.colors.border.main};

  &:last-child {
    border: 0;
  }

  &:hover ${StyledButton} {
    visibility: visible;
  }
`;

export const Td = styled.td`
  padding: ${(p) => p.theme.spacing.sm};
  text-align: left;
`;
