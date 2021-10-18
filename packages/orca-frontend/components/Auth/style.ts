import styled from 'styled-components';

export const SuccessContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

export const SocialButton = styled.a`
  width: 100%;
  display: block;
  border: 2px solid ${(p) => p.theme.colors.border.main};
  border-radius: ${(p) => p.theme.radius.sm};
  padding: ${(p) => p.theme.spacing.xs} ${(p) => p.theme.spacing.xs};
  color: ${(p) => p.theme.colors.general.textSecondary};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: ${(p) => p.theme.font.size.xs};
  cursor: pointer;
  margin-bottom: ${(p) => p.theme.spacing.xs};
  transition: border 0.3s;
  text-decoration: none;

  &:hover {
    border: 2px solid ${(p) => p.theme.colors.general.textSecondary};
  }
`;

export const Or = styled.div`
  text-align: center;
  margin-bottom: ${(p) => p.theme.spacing.sm};
  margin-top: ${(p) => p.theme.spacing.sm};
  color: ${(p) => p.theme.colors.general.textSecondary};
  font-size: ${(p) => p.theme.font.size.tiny};
`;

export const Bottom = styled.div`
  text-align: center;
`;
