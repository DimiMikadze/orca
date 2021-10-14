import styled from 'styled-components';
import { Radius } from '../../theme';

export const Root = styled.div`
  width: 100%;
  position: relative;
`;

export const IconContainer = styled.div`
  position: absolute;
  top: 12px;
  left: 10px;
`;

interface InputProps {
  hideIcon?: boolean;
  backgroundColor?: number;
  hideBorder?: boolean;
  radius?: Radius;
  isDropdownOpen?: boolean;
  focused?: boolean;
}

export const Input = styled.input<InputProps>`
  outline: 0;
  height: 40px;
  width: 100%;
  border: 0;
  border-radius: ${(p) => (p.radius ? p.theme.radius[p.radius] : p.theme.radius.md)};
  padding-left: ${(p) => (p.hideIcon ? p.theme.spacing.xs : p.theme.spacing.lg)};
  padding-right: ${(p) => p.theme.spacing.lg};
  color: ${(p) => p.theme.colors.general.text};
  font-size: ${(p) => p.theme.font.size.xs};
  background-color: ${(p) =>
    p.backgroundColor ? p.theme.colors.grey[p.backgroundColor] : p.theme.colors.general.white};
  transition: background-color 0.1s;

  &:focus {
    background-color: ${(p) => p.theme.colors.general.white};
    border: 1px solid ${(p) => p.theme.colors.border.main};
  }

  ${(p) =>
    !p.hideBorder &&
    `
      border: 1px solid ${p.theme.colors.border.main};

    `}

  ${(p) =>
    p.isDropdownOpen &&
    `
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: 0;
    `}


  &:placeholder {
    color: ${(p) => p.theme.colors.grey[20]};
  }

  @media (max-width: ${(p) => p.theme.screen.sm}) {
    ::-webkit-input-placeholder {
      color: transparent;
    }

    ::placeholder {
      color: transparent;
    }
  }
`;

export const Result = styled.div`
  width: 100%;
  max-height: 500px;
  position: absolute;
  top: 40px;
  background-color: ${(p) => p.theme.colors.general.white};
  overflow: hidden;
  overflow-y: auto;
  z-index: ${(p) => p.theme.zIndex.xl};
  border: 1px solid ${(p) => p.theme.colors.border.main};
  border-top: 0;
  background-color: ${(p) => p.theme.colors.general.white};
  border-bottom-left-radius: ${(p) => p.theme.radius.sm};
  border-bottom-right-radius: ${(p) => p.theme.radius.sm};
  box-shadow: -1px 1px 6px ${(p) => p.theme.colors.grey[30]}, 1px 1px 6px ${(p) => p.theme.colors.grey[30]};
`;

export const Item = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: ${(p) => p.theme.spacing.xs};
  border: 0;
  cursor: pointer;
  background-color: transparent;
  border-bottom: 1px solid ${(p) => p.theme.colors.grey[20]};

  &:hover {
    background-color: ${(p) => p.theme.colors.grey[10]};
  }
`;

export const SearchIcon = styled.div`
  width: 28px;
  flex: 0 0 28px;
  margin-right: ${(p) => p.theme.spacing.xs};
`;

export const SearchedText = styled.div`
  color: ${(p) => p.theme.colors.general.text};
  font-size: ${(p) => p.theme.font.size.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  flex: 1;
  width: 100%;
`;

export const SearchType = styled.div`
  font-size: ${(p) => p.theme.font.size.xxs};
  color: ${(p) => p.theme.colors.general.textSecondary};
  padding: ${(p) => p.theme.spacing.xxs} ${(p) => p.theme.spacing.xxs};
  border: 1px solid ${(p) => p.theme.colors.grey[30]};
  border-radius: ${(p) => p.theme.radius.sm};
  width: 42px;
  flex: 0 0 42px;
  margin-left: ${(p) => p.theme.spacing.xs};
`;

export const Name = styled.div`
  font-weight: ${(p) => p.theme.font.weight.bold};
`;

export const NoSearchResult = styled.div`
  text-align: center;
  padding: ${(p) => p.theme.spacing.xs};
  color: ${(p) => p.theme.colors.general.textSecondary};
`;
