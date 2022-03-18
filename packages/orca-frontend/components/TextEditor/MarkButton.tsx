import { FC } from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { TextBold, TextCode, TextItalic, TextUnderline } from './menuItems';
import { StyledEditorButton } from './style';

interface MarkButtonProps {
  format: string;
}

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const MarkButton: FC<MarkButtonProps> = ({ format }) => {
  const editor = useSlate();

  let MenuItemComponent;
  switch (format) {
    case 'bold':
      MenuItemComponent = TextBold;
      break;
    case 'italic':
      MenuItemComponent = TextItalic;
      break;
    case 'underline':
      MenuItemComponent = TextUnderline;
      break;
    case 'code':
      MenuItemComponent = TextCode;
      break;
  }

  return (
    <StyledEditorButton
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <MenuItemComponent width="20" active={isMarkActive(editor, format)}></MenuItemComponent>
    </StyledEditorButton>
  );
};

export default MarkButton;
