import React, { ForwardRefRenderFunction, forwardRef } from 'react';
import EditorMenu from './EditorMenu';

interface EditorToolbarProps {
  children: React.ReactNode;
}

const EditorToolbar: ForwardRefRenderFunction<HTMLDivElement, EditorToolbarProps> = ({ children, ...props }, ref) => {
  return (
    <EditorMenu {...props} ref={ref}>
      {children}
    </EditorMenu>
  );
};

export default forwardRef(EditorToolbar);
