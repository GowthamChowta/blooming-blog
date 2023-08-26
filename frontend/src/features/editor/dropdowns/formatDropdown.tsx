import { $patchStyleText, $setBlocksType } from '@lexical/selection';
import {
  LexicalEditor,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode
} from 'lexical';
import { useState } from 'react';
import { FONT_FAMILY_OPTIONS } from '../constants';
import { $createHeadingNode } from '@lexical/rich-text';
import { INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';

export function FormatDropDown({
  editor
}: {
  editor: LexicalEditor;
}): JSX.Element {
  const [showDropDown, setShowDropDown] = useState(false);

  function changeBlockToParagraph() {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  }

  function changeBlockToHeading(tag: 'h1' | 'h2' | 'h3') {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  }

  function changeBlockToBulletList() {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  }

  return (
    <div className="dropdown-container">
      <div
        className="toolbar-button"
        onClick={() => setShowDropDown(!showDropDown)}
      >
        <i className="fa-solid fa-paragraph"></i>{' '}
        <i className="fa-solid fa-angle-down"></i>
      </div>
      {showDropDown && (
        <div className="dropdown">
          <button
            className="item"
            key="paragraph"
            onClick={() => changeBlockToParagraph()}
          >
            Paragraph
          </button>
          <button
            className="item"
            key="heading1"
            onClick={() => changeBlockToHeading('h1')}
          >
            H1 :: Heading 1
          </button>
          <button
            className="item"
            key="heading2"
            onClick={() => changeBlockToHeading('h2')}
          >
            H2 :: Heading 2
          </button>
          <button
            className="item"
            key="heading3"
            onClick={() => changeBlockToHeading('h3')}
          >
            H3 :: Heading 3
          </button>
          <button
            className="item"
            key="bulletList"
            onClick={() => changeBlockToBulletList()}
          >
            Bullet List
          </button>
          <button className="item" key="NumberedList">
            Numbered List
          </button>
          <button className="item" key="CheckList">
            Check List
          </button>
        </div>
      )}
    </div>
  );
}
