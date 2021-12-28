import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { HomePage } from 'Forms/home/HomePage';
import { openNewTab } from 'Utilities/openNewTab';

export type Props = {
  app: App;
}

export function HomeButton(props: Props) {
  return (
    <DroppedButton
      text='Home'
      onClick={() => {
        if (props.app.strictDrawing.isEmpty()) {
          props.app.formContainer.renderForm(() => (
            <HomePage app={props.app} />
          ));
        } else {
          openNewTab();
        }
      }}
    />
  );
}
