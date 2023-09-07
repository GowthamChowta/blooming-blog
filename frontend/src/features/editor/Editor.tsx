/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { $getSelection, $isRangeSelection } from 'lexical';
import { useEffect, useState } from 'react';
import './editor.css';
import { CodeNode } from '@lexical/code';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode } from '@lexical/rich-text';
import { $getSelectionStyleValueForProperty } from '@lexical/selection';
import theme from './themes';
import { blockTypeToBlockName } from './constants';
import {
  MyBoldPlugin,
  MyCustomAutoFocusPlugin,
  MyHeadingPlugin
} from './plugins';
import {
  FontSizeDropDown,
  FontStyleDropDown,
  FormatDropDown
} from './dropdowns';
interface Props {}

function onError(error: Error): void {
  console.error(error);
}

function Divider() {
  return <div className="divider"></div>;
}

function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>('paragraph');

  const [fontSize, setFontSize] = useState('15px');
  const [fontStyle, setFontStyle] = useState('Arial');
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [isCode, setIsCode] = useState<boolean>(false);

  function $updateToolbar() {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsCode(selection.hasFormat('code'));

      setFontSize(
        $getSelectionStyleValueForProperty(selection, 'font-size', '15px')
      );
      setFontStyle(
        $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial')
      );
    }
  }
  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        $updateToolbar();
      });
    });
  }, [editor, $updateToolbar]);
  return (
    <div className="toolbar">
      <MyCustomAutoFocusPlugin />
      <MyHeadingPlugin editor={editor} />
      <Divider />
      <MyBoldPlugin
        editor={editor}
        isBold={isBold}
        isItalic={isItalic}
        isCode={isCode}
        isUnderline={isUnderline}
      />
      <Divider />
      <FontSizeDropDown fontsize={fontSize} editor={editor} />
      <FontStyleDropDown fontStyle={fontStyle} editor={editor} />
      <FormatDropDown editor={editor} />
    </div>
  );
}

export default function Editor({}: Props): JSX.Element {
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
    nodes: [HeadingNode, CodeNode]
  };

  return (
    <div className='infinite-height-editable'>
      <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={<ContentEditable className="content-editable" />}
        placeholder={<div className="placeholder">Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
    </LexicalComposer>
    </div>
  );
}
