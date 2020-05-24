import * as React from 'react';
const uuidv1 = require('uuid/v1');

import DroppedButton from '../DroppedButton';

interface App {
  strictDrawing: {
    hasFlatOutermostLoop: () => boolean;
    flatOutermostLoop: () => void;
  }
  pushUndo: () => void;
  drawingChangedNotByInteraction: () => void;
}

function createFlatOutermostLoopButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Flat Outermost Loop'}
      onClick={() => {
        if (app.strictDrawing.hasFlatOutermostLoop()) {
          return;
        }
        app.pushUndo();
        app.strictDrawing.flatOutermostLoop();
        app.drawingChangedNotByInteraction();
      }}
      disabled={app.strictDrawing.hasFlatOutermostLoop()}
      checked={app.strictDrawing.hasFlatOutermostLoop()}
    />
  );
}

export default createFlatOutermostLoopButtonForApp;
