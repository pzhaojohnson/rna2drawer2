import * as React from 'react';
const uuidv1 = require('uuid/v1');

import DroppedButton from '../DroppedButton';

interface App {
  strictDrawing: {
    isEmpty: () => boolean;
  };
  save: () => void;
}

function createSaveButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Save'}
      onClick={() => app.save()}
      disabled={app.strictDrawing.isEmpty()}
    />
  );
}

export default createSaveButtonForApp;
