import styled from 'styled-components';

export const Root = styled.div`
  width: 100%;
  height: 100%;
`;

export const Header = styled.div`
  position: relative;
  background-color: ${(p) => p.theme.colors.general.white};
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 60px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border.main};
`;

export const Container = styled.div`
  margin-right: ${(p) => p.theme.spacing.xxs};
  margin-left: ${(p) => p.theme.spacing.sm};
  padding: ${(p) => p.theme.spacing.xxs} ${(p) => p.theme.spacing.xxs};
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${(p) => p.theme.colors.general.textSecondary};
`;

export const FullName = styled.div`
  padding-left: ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.general.text};
  font-weight: ${(p) => p.theme.font.weight.bold};
`;

export const ScrollWrapper = styled.div`
  height: 100vh;
  margin-top: -120px;
  padding-top: 170px;
  overflow: hidden;
`;

export const MessagesConversation = styled.div`
  padding: 0 ${(p) => p.theme.spacing.sm};
  overflow-y: auto;
  height: 100%;

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${(p) => p.theme.colors.grey[90]};
    border-radius: ${(p) => p.theme.radius.lg};
    visibility: hidden;

    &:hover {
      background-color: ${(p) => p.theme.colors.grey[80]};
    }
  }

  &:hover {
    ::-webkit-scrollbar-thumb {
      visibility: visible;
    }
  }
`;

export const Conversation = styled.div`
  flex: 1;
`;

interface UserMessageProps {
  isSender: boolean;
}

export const MessageDate = styled.span<UserMessageProps>`
  position: absolute;
  bottom: -${(p) => p.theme.spacing.sm};
  left: ${(p) => !p.isSender && p.theme.spacing.lg};
  right: -${(p) => p.isSender && 0};
  display: none;
  font-size: ${(p) => p.theme.font.size.tiny};
  color: ${(p) => p.theme.colors.general.text};
`;

export const MessageWrapper = styled.div<UserMessageProps>`
  display: flex;
  position: relative;
  justify-content: ${(p) => p.isSender && 'flex-end'};
  margin: ${(p) => p.theme.spacing.md} 0;

  &:hover ${MessageDate} {
    display: block;
  }
`;

export const Message = styled.div<UserMessageProps>`
  display: flex;
  flex-direction: row;
  position: relative;
  max-width: 300px;
  line-height: 17px;
  font-size: ${(p) => p.theme.font.size.xxs};
  padding: ${(p) => p.theme.spacing.xxs} ${(p) => p.theme.spacing.xs};
  border-radius: ${(p) => p.theme.radius.md};
  color: ${(p) => p.isSender && p.theme.colors.general.white};
  background-color: ${(p) => (p.isSender ? p.theme.colors.general.primary : p.theme.colors.grey[20])};
`;

export const Form = styled.form`
  background-color: ${(p) => p.theme.colors.general.white};
  position: sticky;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: ${(p) => p.theme.spacing.xxs};
`;

export const Textarea = styled.textarea`
  height: 38px;
  border-radius: ${(p) => p.theme.radius.md};
  background-color: ${(p) => p.theme.colors.grey[10]};
  width: 100%;
  outline: 0;
  resize: none;
  border: 0;
  padding-left: ${(p) => p.theme.spacing.sm};
  padding-top: ${(p) => p.theme.spacing.xs};
  color: ${(p) => p.theme.colors.general.text};
  font-size: ${(p) => p.theme.font.size.xs};

  &::placeholder {
    color: ${(p) => p.theme.colors.general.textSecondary};
  }
`;
