import { $patchStyleText } from '@lexical/selection';
import { LexicalEditor, $getSelection, $isRangeSelection } from 'lexical';
import { useState } from 'react';
import { FONT_SIZE_OPTIONS } from '../constants';

export function FontSizeDropDown({
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
