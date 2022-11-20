import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { OpenSavedDrawingForm } from 'Forms/open/OpenSavedDrawingForm';
import { openNewTabOfApp } from 'Utilities/openNewTabOfApp';

export type Props = {
  app: App;
}

export function OpenButton(props: Props) {
  return (
    <DroppedButton
      text='Open'
      onClick={() => {
        if (props.app.strictDrawing.isEmpty()) {
          props.app.formContainer.renderForm(formProps => (
            <OpenSavedDrawingForm
              app={props.app}
              close={formProps.unmount}
            />
          ));
        } else {
          openNewTabOfApp();
        }
      }}
    />
  );
}
