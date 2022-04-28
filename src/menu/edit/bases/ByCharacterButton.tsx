import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { EditBasesByCharacterForm } from 'Forms/edit/bases/by/character/EditBasesByCharacterForm';
import { v4 as uuidv4 } from 'uuid';

export type Props = {
  app: App;
}

const formKey = uuidv4();

export function ByCharacterButton(props: Props) {
  return (
    <DroppedButton
      text='By Character'
      onClick={() => {
        props.app.formContainer.renderForm(formProps => (
          <EditBasesByCharacterForm {...formProps} app={props.app} />
        ), { key: formKey });
      }}
    />
  );
}
