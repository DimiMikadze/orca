import React, { useCallback, useMemo, useState, FC } from 'react';
import { Editable, withReact, Slate, ReactEditor } from 'slate-react';
import isHotkey from 'is-hotkey';
import { createEditor, Descendant, BaseEditor, Editor } from 'slate';
import EditorToolbar from './EditorToolbar';
import { StyledDivider } from './style';
import BlockButton from './BlockButton';
import MarkButton, { toggleMark } from './MarkButton';
import { ContainerElement } from './ContainerElement';
import LeafElement from './LeafElement';

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

type CustomElementTypes =
  | 'paragraph'
  | 'block-quote'
  | 'bulleted-list'
  | 'heading-one'
  | 'heading-two'
  | 'heading-three'
  | 'list-item'
  | 'numbered-list';
type CustomText = {
  text?: string;
  bold?: boolean;
  code?: boolean;
  italic?: boolean;
  underline?: boolean;
  type?: CustomElementTypes;
  children?: CustomText[];
};

export type CustomElement = { type: CustomElementTypes; children: CustomText[] };

export interface CustomRenderLeafProps {
  children: any;
  leaf: CustomText;
  text: Text;
  attributes: {
    'data-slate-leaf': true;
  };
}

interface TextEditorProps {
  isReadOnly?: boolean;
  placeholderText?: string;
  name?: string;
  post?: CustomElement[];
  [x: string]: any;
}

const initialValue: CustomElement[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

const TextEditor: FC<TextEditorProps> = ({ isReadOnly, placeholderText, post, name, onChange }) => {
  const [value, setValue] = useState<Descendant[]>(post);
  const renderElement = useCallback((props) => <ContainerElement {...props} />, []);
  const renderLeaf = useCallback((props) => <LeafElement {...props} />, []);
  const editor = useMemo(() => withReact(createEditor()), []);

  const handleChange = (value) => {
    console.log(Editor.hasTexts(editor, initialValue[0]));
    setValue(value);
    if (onChange) {
      onChange(name, value);
    }
  };

  return (
    <Slate editor={editor} value={value} onChange={(value) => !isReadOnly && handleChange(value)}>
      {!isReadOnly && (
        <EditorToolbar>
          <BlockButton format="heading-one" />
          <BlockButton format="heading-two" />
          <BlockButton format="heading-three" />
          <StyledDivider />
          <MarkButton format="bold" />
          <MarkButton format="italic" />
          <MarkButton format="underline" />
          <MarkButton format="code" />
          <StyledDivider />
          <BlockButton format="block-quote" />
          <BlockButton format="bulleted-list" />
          <BlockButton format="numbered-list" />
        </EditorToolbar>
      )}
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={placeholderText}
        spellCheck
        autoFocus
        readOnly={isReadOnly}
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
      />
    </Slate>
  );
};

TextEditor.defaultProps = {
  isReadOnly: false,
  post: initialValue,
  name: 'post',
};

export default TextEditor;
