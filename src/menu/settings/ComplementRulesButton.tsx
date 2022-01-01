import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { ComplementRules } from 'Forms/settings/complements/ComplementRules';
import { v4 as uuidv4 } from 'uuid';

export type Props = {
  app: App;
}

const formKey = uuidv4();

export function ComplementRulesButton(props: Props) {
  return (
    <DroppedButton
      text='Complement Rules'
      onClick={() => {
        props.app.formContainer.renderForm(formProps => (
          <ComplementRules {...formProps} app={props.app} />
        ), { key: formKey });
      }}
    />
  );
}
