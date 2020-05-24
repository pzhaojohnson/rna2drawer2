import * as React from 'react';
const uuidv1 = require('uuid/v1');

import DroppedButton from '../DroppedButton';

interface App {
  strictDrawing: {
    hasRoundOutermostLoop: () => boolean;
    roundOutermostLoop: () => void;
  }
  pushUndo: () => void;
  drawingChangedNotByInteraction: () => void;
}

function createRoundOutermostLoopButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Round Outermost Loop'}
      onClick={() => {
        if (app.strictDrawing.hasRoundOutermostLoop()) {
          return;
        }
        app.pushUndo();
        app.strictDrawing.roundOutermostLoop();
        app.drawingChangedNotByInteraction();
      }}
      disabled={app.strictDrawing.hasRoundOutermostLoop()}
      checked={app.strictDrawing.hasRoundOutermostLoop()}
    />
  );
}

export default createRoundOutermostLoopButtonForApp;
