import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
import openNewTab from '../openNewTab';
import { OpenRna2drawer } from '../../forms/open/OpenRna2drawer';

interface Props {
  app: App;
}

export function OpenButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Open'}
      onClick={() => {
        if (!props.app.strictDrawing.isEmpty()) {
          openNewTab();
        } else {
          props.app.renderForm(close => (
            <OpenRna2drawer
              app={props.app}
              close={close}
            />
          ));
        }
      }}
      disabled={!props.app.strictDrawing.isEmpty()}
    />
  );
}
