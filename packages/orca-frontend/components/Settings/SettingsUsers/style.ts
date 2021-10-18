import styled from 'styled-components';
import { lighten } from 'polished';
import { Button } from '../../ui';

export const Top = styled.div`
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

export const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-top: ${(p) => p.theme.spacing.md};
`;

export const Form = styled.form`
  position: relative;
  margin-right: ${(p) => p.theme.spacing.xs};
  width: 100%;
`;

export const SearchClearButton = styled(Button)`
  position: absolute;
  top: 12px;
  right: ${(p) => p.theme.spacing.sm};
`;

export const SearchInput = styled.input`
  outline: 0;
  height: 38px;
  width: 100%;
  border: 1px solid ${(p) => p.theme.colors.border.main};
  border-radius: ${(p) => p.theme.radius.sm};
  padding: 0 ${(p) => p.theme.spacing.xs};
  color: ${(p) => p.theme.colors.general.text};
  font-size: ${(p) => p.theme.font.size.xs};
  transition: border-color 0.1s;

  &:focus {
    border-color: ${(p) => p.theme.colors.border.dark};
  }

  &:placeholder {
    color: ${(p) => p.theme.colors.grey[20]};
  }
`;

export const TableContainer = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  white-space: nowrap;
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

interface TrProps {
  bgColor?: string;
}

export const Tr = styled.tr<TrProps>`
  position: relative;
  border-top: 1px solid ${(p) => p.theme.colors.border.main};
  border-bottom: 1px solid ${(p) => p.theme.colors.border.main};
  background-color: ${(p) => (p.bgColor ? lighten(0.3, p.theme.colors.general[p.bgColor]) : 'transparent')};

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
