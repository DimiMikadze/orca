import React, { ForwardRefRenderFunction, forwardRef } from 'react';
import { StyledEditorMenu } from './style';

interface EditorMenuProps {
  children: React.ReactNode;
}

const EditorMenu: ForwardRefRenderFunction<HTMLDivElement, EditorMenuProps> = ({ children, ...props }, ref) => {
  return (
    <StyledEditorMenu {...props} ref={ref}>
      {children}
    </StyledEditorMenu>
  );
};

export default forwardRef(EditorMenu);
