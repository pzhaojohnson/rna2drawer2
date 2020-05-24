import * as React from 'react';
const uuidv1 = require('uuid/v1');

import DroppedButton from '../DroppedButton';

interface App {
  strictDrawingInteraction: {
    pivoting: () => boolean;
    startPivoting: () => void;
  }
}

function createPivotButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Pivot Stems'}
      onClick={() => {
        if (app.strictDrawingInteraction.pivoting()) {
          return;
        }
        app.strictDrawingInteraction.startPivoting();
      }}
      disabled={app.strictDrawingInteraction.pivoting()}
      checked={app.strictDrawingInteraction.pivoting()}
    />
  );
}

export default createPivotButtonForApp;
