import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { EditSequenceId } from 'Forms/edit/sequence/EditSequenceId';

export type Props = {
  app: App;
}

export function EditSequenceIdButton(props: Props) {
  return (
    <DroppedButton
      text='Sequence ID'
      onClick={() => {
        props.app.renderForm(unmount => (
          <EditSequenceId app={props.app} unmount={unmount} />
        ));
      }}
    />
  );
}
