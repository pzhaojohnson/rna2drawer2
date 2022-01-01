import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { EditSequenceId } from 'Forms/edit/sequence/EditSequenceId';
import { v4 as uuidv4 } from 'uuid';

export type Props = {
  app: App;
}

const formKey = uuidv4();

export function EditSequenceIdButton(props: Props) {
  return (
    <DroppedButton
      text='Sequence ID'
      onClick={() => {
        props.app.formContainer.renderForm(formProps => (
          <EditSequenceId {...formProps} app={props.app} />
        ), { key: formKey });
      }}
    />
  );
}
