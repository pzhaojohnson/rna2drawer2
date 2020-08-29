import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
const uuidv1 = require('uuid/v1');
import DroppedButton from '../DroppedButton';
import openNewTab from '../openNewTab';
import { CreateNewDrawing } from '../../forms/new/CreateNewDrawing';

function createNewButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'New'}
      onClick={() => {
        if (!app.strictDrawing.isEmpty()) {
          openNewTab();
        } else {
          app.renderForm(close => (
            <CreateNewDrawing app={app} close={close ? close : () => app.unmountCurrForm()} />
          ));
        }
      }}
    />
  );
}

export default createNewButtonForApp;
