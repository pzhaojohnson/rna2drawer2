import * as React from 'react';
const uuidv1 = require('uuid/v1');

import DroppedButton from '../DroppedButton';

interface App {
  strictDrawingInteraction: {
    folding: () => boolean;
    startFolding: () => void;
  }
}

function createFoldButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Modify Base Pairs'}
      onClick={() => {
        if (app.strictDrawingInteraction.folding()) {
          return;
        }
        app.strictDrawingInteraction.startFolding();
      }}
      disabled={app.strictDrawingInteraction.folding()}
      checked={app.strictDrawingInteraction.folding()}
    />
  );
}

export default createFoldButtonForApp;
