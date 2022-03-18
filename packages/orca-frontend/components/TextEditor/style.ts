import styled from 'styled-components';

export const StyledEditorButton = styled.span`
  cursor: pointer;
  display: inline-block;
  width: 28px;
  height: 28px;
  padding: 4px;
`;

export const StyledEditorMenu = styled.div`
  position: relative;
  padding: ${(p) => p.theme.spacing.xxs};
  border-bottom: 2px solid ${(p) => p.theme.colors.border.light};
  margin-bottom: ${(p) => p.theme.spacing.sm};
`;

export const StyledBlockQuote = styled.blockquote`
  border-left: 2px solid #ddd;
  margin-left: 0;
  margin-right: 0;
  padding-left: 10px;
  color: #aaa;
  font-style: italic;
`;

export const StyledCodeBlock = styled.code`
  font-family: monospace;
  background-color: #eee;
  padding: 3px;
`;

export const StyledDivider = styled.span`
  display: inline-block;
  width: 2px;
  background-color: ${(p) => p.theme.colors.grey[40]};
  margin: 0 10px;
  height: 24px;
`;
