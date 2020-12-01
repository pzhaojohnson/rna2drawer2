import { AppInterface as App } from '../../AppInterface';
import * as React from 'react';
import { DroppedButton } from '../DroppedButton';
import { HomePage } from '../../forms/home/HomePage';
import openNewTab from '../openNewTab';

interface Props {
  app: App;
}

export function HomeButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text='Home'
      onClick={() => {
        if (props.app.strictDrawing.isEmpty()) {
          props.app.renderForm(() => (
            <HomePage app={props.app} />
          ));
        } else {
          openNewTab();
        }
      }}
    />
  );
}
