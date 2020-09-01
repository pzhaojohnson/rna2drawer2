import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
const uuidv1 = require('uuid/v1');
import openNewTab from '../openNewTab';
import { CreateNewDrawing } from '../../forms/new/CreateNewDrawing';

interface Props {
  app: App;
}

export function NewButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'New'}
      onClick={() => {
        if (!props.app.strictDrawing.isEmpty()) {
          openNewTab();
        } else {
          props.app.renderForm(close => (
            <CreateNewDrawing app={props.app} close={close ? close : () => props.app.unmountCurrForm()} />
          ));
        }
      }}
    />
  );
}
