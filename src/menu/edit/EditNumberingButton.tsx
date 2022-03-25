import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { EditNumbering } from 'Forms/edit/EditNumbering';
import { v4 as uuidv4 } from 'uuid';

export type Props = {
  app: App;
}

const formKey = uuidv4();

export function EditNumberingButton(props: Props) {
  return (
    <DroppedButton
      text='Numbering'
      onClick={() => {
        props.app.formContainer.renderForm(formProps => (
          <EditNumbering {...formProps} app={props.app} />
        ), { key: formKey });
      }}
    />
  );
}
