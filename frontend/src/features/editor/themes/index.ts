import { EditorThemeClasses } from 'lexical/LexicalEditor';
import './themes.css';

const theme: EditorThemeClasses = {
  // Theme styling goes here
  heading: {
    h1: 'blog-editor-h1'
  },
  text: {
    bold: 'blog-editor-bold',
    italic: 'blog-editor-italic',
    underline: 'blog-editor-underline',
    code: 'blog-editor-code'
  }
};

export default theme;
