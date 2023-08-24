import { $createHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $getSelection, $isRangeSelection, LexicalEditor } from 'lexical';

export function MyHeadingPlugin({ editor }: { editor: LexicalEditor }) {
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
