import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { AddSubsequenceForm } from 'Forms/edit/sequences/subsequences/add/AddSubsequenceForm';
import { v4 as uuidv4 } from 'uuid';

export type Props = {
  app: App;
}

const formKey = uuidv4();

export function AddSubsequenceButton(props: Props) {
  return (
    <DroppedButton
      text='Add Subsequence'
      onClick={() => {
        props.app.formContainer.renderForm(formProps => (
          <AddSubsequenceForm {...formProps} app={props.app} />
        ), { key: formKey });
      }}
    />
  );
}
