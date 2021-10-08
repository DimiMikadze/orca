import styled from 'styled-components';

export const SelectContainer = styled.div`
  display: flex;
  vertical-align: center;
  margin-top: ${(p) => p.theme.spacing.sm};
  padding: 0 ${(p) => p.theme.spacing.xs};
`;

export const Options = styled.div`
  border: 1px solid ${(p) => p.theme.colors.grey[40]};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(p) => p.theme.spacing.sm};
  padding: ${(p) => p.theme.spacing.xxs} 0 ${(p) => p.theme.spacing.xxs} ${(p) => p.theme.spacing.xs};
  border-radius: ${(p) => p.theme.radius.md};
`;

export const OptionsText = styled.span`
  font-size: ${(p) => p.theme.font.size.xs};
`;

export const ImagePreviewContainer = styled.div`
  position: relative;
  width: 100%;
  max-height: 300px;
  overflow: hidden;
  flex-shrink: 0;
  overflow: auto;
  box-shadow: ${(p) => p.theme.shadows.sm};
`;

export const CloseIconContainer = styled.div`
  position: absolute;
  right: ${(p) => p.theme.spacing.sm};
  top: ${(p) => p.theme.spacing.sm};
`;

export const ImagePreview = styled.img`
  width: 100%;
  display: block;
  object-fit: cover;
`;
