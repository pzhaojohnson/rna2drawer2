import * as React from 'react';
const uuidv1 = require('uuid/v1');

import DroppedButton from '../DroppedButton';

import openNewTab from '../openNewTab';
import renderOpenRna2drawerInApp from '../../forms/open/rna2drawer/renderOpenRna2drawerInApp';
import App from '../../App';

function createOpenRna2drawerButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Open'}
      onClick={() => {
        if (!app.strictDrawing.isEmpty()) {
          openNewTab();
          return;
        }
        renderOpenRna2drawerInApp(app);
      }}
      disabled={!app.strictDrawing.isEmpty()}
    />
  );
}

export default createOpenRna2drawerButtonForApp;
