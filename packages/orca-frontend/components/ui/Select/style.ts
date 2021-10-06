import styled from 'styled-components';

export const SelectElement = styled.select`
  outline: none;
  appearance: none;
  background: transparent;
  text-overflow: ellipsis;
  padding-top: ${(p) => p.theme.spacing.xs};
  padding-bottom: ${(p) => p.theme.spacing.xs};
  padding-left: ${(p) => p.theme.spacing.xs};
  padding-right: ${(p) => p.theme.spacing.lg};
  background-repeat: no-repeat;
  background-size: 7px 7px, 7px 7px, 0.8em 0.8em;
  background-image: linear-gradient(45deg, transparent 50%, grey 50%),
    linear-gradient(135deg, grey 50%, transparent 50%);
  background-position: calc(100% - 20px) calc(1em + 2px), calc(100% - 13px) calc(1em + 2px), 100% 0;
  font-size: ${(p) => p.theme.font.size.xs};
  border-radius: ${(p) => p.theme.radius.sm};
  border-color: ${(p) => p.theme.colors.border.main};
`;
