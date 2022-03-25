import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { OpenRna2drawer } from 'Forms/open/OpenRna2drawer';
import { openNewTab } from 'Utilities/openNewTab';

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
            <OpenRna2drawer
              app={props.app}
              close={formProps.unmount}
            />
          ));
        } else {
          openNewTab();
        }
      }}
      disabled={!props.app.strictDrawing.isEmpty()}
    />
  );
}
