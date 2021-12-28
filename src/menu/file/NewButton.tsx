import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { CreateNewDrawing } from 'Forms/new/CreateNewDrawing';
import { openNewTab } from 'Utilities/openNewTab';

export type Props = {
  app: App;
}

export function NewButton(props: Props) {
  return (
    <DroppedButton
      text='New'
      onClick={() => {
        if (props.app.strictDrawing.isEmpty()) {
          props.app.renderForm(formProps => (
            <CreateNewDrawing
              app={props.app}
              close={formProps.unmount}
            />
          ));
        } else {
          openNewTab();
        }
      }}
    />
  );
}
