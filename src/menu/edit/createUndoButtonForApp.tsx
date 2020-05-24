import * as React from 'react';
const uuidv1 = require('uuid/v1');

import DroppedButton from '../DroppedButton';

interface App {
  undo: () => void;
  canUndo: () => boolean;
}

function createUndoButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Undo'}
      onClick={() => app.undo()}
      disabled={!app.canUndo()}
      keyBinding={'Ctrl+Z'}
    />
  );
}

export default createUndoButtonForApp;
