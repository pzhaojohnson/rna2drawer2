import * as React from 'react';
const uuidv1 = require('uuid/v1');

import DroppedButton from '../DroppedButton';

import openNewTab from '../openNewTab';
import { OpenRna2drawer } from '../../forms/open/OpenRna2drawer';
import App from '../../App';

function createOpenRna2drawerButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Open'}
      onClick={() => {
        if (!app.strictDrawing.isEmpty()) {
          openNewTab();
        } else {
          app.renderForm(close => (
            <OpenRna2drawer
              app={app}
              close={() => close ? close() : app.unmountCurrForm()}
            />
          ));
        }
      }}
      disabled={!app.strictDrawing.isEmpty()}
    />
  );
}

export default createOpenRna2drawerButtonForApp;
