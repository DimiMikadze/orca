import styled from 'styled-components';

export const LabelAndToggle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const PrimaryColor = styled.div`
  position: relative;
`;

interface PrimaryColorPreviewProps {
  color: string;
}

export const PrimaryColorPreview = styled.div<PrimaryColorPreviewProps>`
  position: absolute;
  right: 3px;
  bottom: 4px;
  border-radius: ${(p) => p.theme.radius.sm};
  width: 28px;
  height: 28px;
  background-color: ${(p) => p.color};
`;

export const CommunityLogoContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const CommunityLogo = styled.img`
  border: 1px solid ${(p) => p.theme.colors.grey[30]};
  width: 100px;
  display: block;
`;

export const Input = styled.input`
  display: none;
`;

export const Label = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  font-weight: ${(p) => p.theme.font.weight.bold};
  font-size: ${(p) => p.theme.font.size.xxs};
  background-color: rgb(255, 255, 255, 0.9);
  padding: ${(p) => p.theme.spacing.xxs} ${(p) => p.theme.spacing.xs};
  border-radius: ${(p) => p.theme.radius.lg};
  transition: background-color 0.2s;

  &:hover {
    background-color: rgb(255, 255, 255, 0.9);
  }
`;

export const Text = styled.div`
  margin-left: ${(p) => p.theme.spacing.xxs};
`;
