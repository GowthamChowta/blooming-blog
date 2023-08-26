import { $patchStyleText } from '@lexical/selection';
import { LexicalEditor, $getSelection, $isRangeSelection } from 'lexical';
import { useState } from 'react';
import { FONT_FAMILY_OPTIONS } from '../constants';

export function FontStyleDropDown({
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
