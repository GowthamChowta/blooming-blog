import { $createHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { FORMAT_TEXT_COMMAND } from 'lexical';
import { LexicalEditor } from 'lexical/LexicalEditor';
import { $getSelection, $isRangeSelection } from 'lexical/LexicalSelection';

export function MyBoldPlugin({
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
