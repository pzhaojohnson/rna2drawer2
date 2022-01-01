import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { EditLayout } from 'Forms/edit/layout/EditLayout';
import { v4 as uuidv4 } from 'uuid';

export type Props = {
  app: App;
}

const formKey = uuidv4();

export function EditLayoutButton(props: Props) {
  return (
    <DroppedButton
      text='Layout'
      onClick={() => {
        props.app.formContainer.renderForm(formProps => (
          <EditLayout {...formProps} app={props.app} />
        ), { key: formKey });
      }}
    />
  );
}
