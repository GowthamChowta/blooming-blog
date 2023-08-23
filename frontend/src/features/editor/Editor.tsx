/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-empty-interface */

import {
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  EditorState,
  EditorThemeClasses,
  FORMAT_TEXT_COMMAND,
  LexicalEditor
} from 'lexical';
import { useEffect, useState } from 'react';
import './editor.css';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { $createHeadingNode, HeadingNode } from '@lexical/rich-text';
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
  $setBlocksType
} from '@lexical/selection';
import theme from './themes';
import {
  FONT_FAMILY_OPTIONS,
  FONT_SIZE_OPTIONS,
  blockTypeToBlockName
} from './constants';
interface Props {}

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error): void {
  console.error(error);
}

function FontStyleDropDown({
  fontStyle,
  editor
}: {
  fontStyle: string;
  editor: LexicalEditor;
}): JSX.Element {
  const [showDropDown, setShowDropDown] = useState(false);
  function onClick(option: any) {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        console.log('Changing font style', option);
        $patchStyleText(selection, {
          ['font-family']: option
        });
      }
    });
  }
  return (
    <div className="dropdown-container">
      <div
        className="toolbar-button"
        onClick={() => setShowDropDown(!showDropDown)}
      >
        <i className="fa-solid fa-font"></i>{' '}
        <i className="fa-solid fa-angle-down"></i>
      </div>
      {showDropDown && (
        <div className="dropdown">
          {FONT_FAMILY_OPTIONS.map(([option, text]) => {
            return (
              <button
                className="item"
                key={option}
                onClick={() => {
                  onClick(option);
                  setShowDropDown(!showDropDown);
                }}
              >
                <span className="text">{option}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FontSizeDropDown({
  fontsize,
  editor
}: {
  fontsize: string;
  editor: LexicalEditor;
}): JSX.Element {
  const [showDropDown, setShowDropDown] = useState(false);
  function onClick(option: any) {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          ['font-size']: option
        });
      }
    });
  }
  return (
    <div className="dropdown-container">
      <div
        className="toolbar-button"
        onClick={() => setShowDropDown(!showDropDown)}
      >
        {fontsize} <i className="fa-solid fa-angle-down"></i>
      </div>
      {showDropDown && (
        <div className="dropdown">
          {FONT_SIZE_OPTIONS.map(([option, text]) => {
            console.log(option);
            return (
              <button
                className="font-size item"
                key={option}
                onClick={() => {
                  onClick(option);
                  setShowDropDown(!showDropDown);
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MyBoldPlugin({
  editor,
  isBold,
  isItalic,
  isCode,
  isUnderline
}: {
  editor: LexicalEditor;
  isBold: boolean;
  isItalic: boolean;
  isCode: boolean;
  isUnderline: boolean;
}) {
  const onClickBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };
  const onClickItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };
  const onClickUnderline = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  };
  const onClickCode = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
  };

  return (
    <div>
      <button
        className={`toolbar-button ${isBold && 'active'}`}
        onClick={onClickBold}
      >
        <i className="fa-solid fa-bold"></i>
      </button>
      <button
        className={`toolbar-button ${isItalic && 'active'}`}
        onClick={onClickItalic}
      >
        <i className="fa-solid fa-italic"></i>
      </button>
      <button
        className={`toolbar-button ${isUnderline && 'active'}`}
        onClick={onClickUnderline}
      >
        <i className="fa-solid fa-underline"></i>
      </button>
      <button
        className={`toolbar-button ${isCode && 'active'}`}
        onClick={onClickCode}
      >
        <i className="fa-solid fa-code"></i>
      </button>
    </div>
  );
}

function MyHeadingPlugin({ editor }: { editor: LexicalEditor }) {
  const onClick = (tag: 'h1' | 'h2' | 'h3'): void => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };

  return (
    <div>
      {['h1', 'h2', 'h3'].map((item) => (
        <button
          className="toolbar-button"
          key={item}
          onClick={() => onClick(item as 'h1' | 'h2' | 'h3')}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
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
      console.log('Setting font size');
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
    console.log('Testing');
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
      <MyHeadingPlugin editor={editor} />
      <MyBoldPlugin
        editor={editor}
        isBold={isBold}
        isItalic={isItalic}
        isCode={isCode}
        isUnderline={isUnderline}
      />
      <FontSizeDropDown fontsize={fontSize} editor={editor} />
      <FontStyleDropDown fontStyle={fontStyle} editor={editor} />
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
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={<ContentEditable className="contentEditable" />}
        placeholder={<div className="placeholder">Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
    </LexicalComposer>
  );
}
