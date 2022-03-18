import { FC } from 'react';
import { Editor, Element as SlateElement, Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { BulletedList, NumberedList, TextBlockQuote, TextHeader1, TextHeader2, TextHeader3 } from './menuItems';
import { StyledEditorButton } from './style';

interface BlockButtonProps {
  format: string;
}

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const isBlockActive = (editor: Editor, format: string) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  );

  return !!match;
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && LIST_TYPES.includes(n.type),
    split: true,
  });
  const newProperties: Partial<SlateElement> = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  };
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const BlockButton: FC<BlockButtonProps> = ({ format }) => {
  const editor = useSlate();

  let MenuItemComponent;
  switch (format) {
    case 'heading-one':
      MenuItemComponent = TextHeader1;
      break;
    case 'heading-two':
      MenuItemComponent = TextHeader2;
      break;
    case 'heading-three':
      MenuItemComponent = TextHeader3;
      break;
    case 'block-quote':
      MenuItemComponent = TextBlockQuote;
      break;
    case 'bulleted-list':
      MenuItemComponent = BulletedList;
      break;
    case 'numbered-list':
      MenuItemComponent = NumberedList;
      break;
  }

  return (
    <StyledEditorButton
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <MenuItemComponent width={20} active={isBlockActive(editor, format)}></MenuItemComponent>
    </StyledEditorButton>
  );
};

export default BlockButton;
