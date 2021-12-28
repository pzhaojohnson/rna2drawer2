import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { EditDrawingTitle } from 'Forms/edit/title/EditDrawingTitle';

export type Props = {
  app: App;
}

export function EditDrawingTitleButton(props: Props) {
  return (
    <DroppedButton
      text='Drawing Title'
      onClick={() => {
        props.app.renderForm(formProps => (
          <EditDrawingTitle app={props.app} unmount={formProps.unmount} />
        ));
      }}
    />
  );
}
