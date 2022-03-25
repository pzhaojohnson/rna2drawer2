import type { App } from 'App';

import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { FindMotifsForm } from 'Forms/motifs/FindMotifsForm';
import { v4 as uuidv4 } from 'uuid';

export type Props = {

  // a reference to the whole app
  app: App;
};

const formKey = uuidv4();

export function FindMotifsButton(props: Props) {
  return (
    <DroppedButton
      text='Find Motifs'
      onClick={() => {
        props.app.formContainer.renderForm(formProps => (
          <FindMotifsForm {...formProps} app={props.app} />
        ), { key: formKey });
      }}
    />
  );
}
