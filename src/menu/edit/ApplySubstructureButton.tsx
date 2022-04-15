import type { App } from 'App';

import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';

import { ApplySubstructureForm } from 'Forms/edit/substructures/ApplySubstructureForm';
import { v4 as uuidv4 } from 'uuid';

const formKey = uuidv4();

export type Props = {

  // a reference to the whole app
  app: App;
};

export function ApplySubstructureButton(props: Props) {
  return (
    <DroppedButton
      text='Apply Substructure'
      onClick={() => {
        props.app.formContainer.renderForm(formProps => (
          <ApplySubstructureForm
            {...formProps}
            app={props.app}
          />
        ), { key: formKey });
      }}
    />
  );
}
