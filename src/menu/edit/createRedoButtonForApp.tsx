import * as React from 'react';
const uuidv1 = require('uuid/v1');

import DroppedButton from '../DroppedButton';

interface App {
  redo: () => void;
  canRedo: () => boolean;
}

function createRedoButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Redo'}
      onClick={() => app.redo()}
      disabled={!app.canRedo()}
      keyBinding={'Ctrl+Shift+Z'}
    />
  );
}

export default createRedoButtonForApp;
