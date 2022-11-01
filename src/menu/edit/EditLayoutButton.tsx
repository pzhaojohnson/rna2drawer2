import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { EditLayoutForm } from 'Forms/edit/layout/EditLayoutForm';
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
          <EditLayoutForm {...formProps} app={props.app} />
        ), { key: formKey });
      }}
      style={{ borderRadius: '0px 0px 4px 4px' }}
    />
  );
}
