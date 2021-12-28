import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { EditLayout } from 'Forms/edit/layout/EditLayout';

export type Props = {
  app: App;
}

export function EditLayoutButton(props: Props) {
  return (
    <DroppedButton
      text='Layout'
      onClick={() => {
        props.app.formContainer.renderForm(formProps => (
          <EditLayout app={props.app} unmount={formProps.unmount} />
        ));
      }}
    />
  );
}
