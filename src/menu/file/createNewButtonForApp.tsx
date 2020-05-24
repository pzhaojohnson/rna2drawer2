import * as React from 'react';
const uuidv1 = require('uuid/v1');

import DroppedButton from '../DroppedButton';

import openNewTab from '../openNewTab';
import renderCreateNewDrawingInApp from '../../forms/renderCreateNewDrawingInApp';

interface App {
  strictDrawing: {
    isEmpty: () => boolean;
  }
}

function createNewButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'New'}
      onClick={() => {
        if (!app.strictDrawing.isEmpty()) {
          openNewTab();
          return;
        }
        renderCreateNewDrawingInApp(app);
      }}
    />
  );
}

export default createNewButtonForApp;
