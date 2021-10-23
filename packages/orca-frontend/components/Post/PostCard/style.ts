import styled from 'styled-components';
import { Button } from '../../ui';

export const Root = styled.div`
  position: relative;
  width: 100%;
  background-color: ${(p) => p.theme.colors.general.white};
  margin-bottom: ${(p) => p.theme.spacing.sm};
  border-radius: ${(p) => p.theme.radius.md};
  box-shadow: ${(p) => p.theme.shadows.sm};
`;

export const Top = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${(p) => p.theme.spacing.xs} ${(p) => p.theme.spacing.sm};
`;

export const Author = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Name = styled.span`
  font-size: ${(p) => p.theme.font.size.xs};
  font-weight: ${(p) => p.theme.font.weight.bold};
`;

export const CreatedAt = styled.div`
  font-size: ${(p) => p.theme.font.size.tiny};
  color: ${(p) => p.theme.colors.general.textSecondary};
  margin-top: ${(p) => p.theme.spacing.xxs};
`;

export const Image = styled.img`
  width: 100%;
  display: block;
`;

export const TitleContainer = styled.div`
  overflow: hidden;
  padding: 0 ${(p) => p.theme.spacing.sm};
  margin-top: ${(p) => p.theme.spacing.xs};
  margin-bottom: ${(p) => p.theme.spacing.xs};
`;

export const Title = styled.span`
  white-space: pre-line;
  word-wrap: break-word;
  display: block;
  font-size: ${(p) => p.theme.font.size.sm};
`;

export const Popover = styled.div`
  position: relative;
`;

export const PopoverContent = styled.div`
  border-radius: ${(p) => p.theme.radius.sm};
  position: absolute;
  top: 20px;
  left: -140px;
  background-color: ${(p) => p.theme.colors.general.white};
  width: 160px;
  box-shadow: ${(p) => p.theme.shadows.md};
  z-index: 1;
  overflow: hidden;
`;

interface LikeAndCommentsCountProps {
  hadData: string;
}

export const LikeAndCommentsCount = styled.div<LikeAndCommentsCountProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: ${(p) => p.theme.font.size.xs};
  color: ${(p) => p.theme.colors.general.textSecondary};
  ${(p) =>
    p.hadData &&
    `
    padding: ${p.theme.spacing.sm} ${p.theme.spacing.sm} ${p.theme.spacing.xs}
  `};
`;

interface LikeAndCommentButtonsProps {
  isCommentSectionOpen: boolean;
}

export const LikeAndCommentButtons = styled.div<LikeAndCommentButtonsProps>`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  height: 52px;
  border-top: 1px solid ${(p) => p.theme.colors.border.main};

  ${(p) =>
    !p.isCommentSectionOpen &&
    `border-bottom-left-radius: ${p.theme.radius.sm};
    border-bottom-right-radius: ${p.theme.radius.sm};
  `}
`;

export const StyledButton = styled(Button)`
  padding: ${(p) => p.theme.spacing.xs};
`;

export const Share = styled.div`
  position: relative;
  width: 100%;
  display: flex;
`;

export const SharePopover = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  right: ${(p) => p.theme.spacing.xs};
  bottom: 44px;
  align-items: left;
  padding: ${(p) => p.theme.spacing.xs} 0;
  background-color: ${(p) => p.theme.colors.general.white};
  z-index: ${(p) => p.theme.zIndex.xl};
  border-radius: ${(p) => p.theme.radius.sm};
  box-shadow: ${(p) => p.theme.shadows.md};
`;

export const ShareItem = styled.div`
  position: relative;
  padding: ${(p) => p.theme.spacing.xs} ${(p) => p.theme.spacing.lg};
  color: ${(p) => p.theme.colors.general.textSecondary};
  display: flex;
  justify-content: flex-start;
  font-size: ${(p) => p.theme.font.size.xs};

  &:hover {
    background-color: ${(p) => p.theme.colors.grey[10]};
    color: ${(p) => p.theme.colors.general.text};
  }
`;

export const ShareButton = styled(Button)`
  padding: ${(p) => p.theme.spacing.xs} ${(p) => p.theme.spacing.lg};
  display: flex;
  justify-content: flex-start;

  &:hover {
    color: ${(p) => p.theme.colors.general.text};
  }
`;

export const Comments = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.border.main};
`;
