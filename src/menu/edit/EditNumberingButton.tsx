import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { EditNumbering } from 'Forms/edit/EditNumbering';

export type Props = {
  app: App;
}

export function EditNumberingButton(props: Props) {
  return (
    <DroppedButton
      text='Numbering'
      onClick={() => {
        props.app.formContainer.renderForm(formProps => (
          <EditNumbering {...formProps} app={props.app} />
        ));
      }}
    />
  );
}
