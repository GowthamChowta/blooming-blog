import React from 'react';
import Editor from './features/editor/Editor';

function App() {
  return (
    <div className="App">
      <h1>This is one stop to know whats happening in Bloomington</h1>
      <div className="editorWrapper">
        <Editor />
      </div>
    </div>
  );
}

export default App;
