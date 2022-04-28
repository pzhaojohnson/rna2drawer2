import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { RemoveSubsequenceForm } from 'Forms/edit/sequence/removeSubsequence/RemoveSubsequenceForm';
import { v4 as uuidv4 } from 'uuid';

export type Props = {
  app: App;
}

const formKey = uuidv4();

export function RemoveSubsequenceButton(props: Props) {
  return (
    <DroppedButton
      text='Remove Subsequence'
      onClick={() => {
        props.app.formContainer.renderForm(formProps => (
          <RemoveSubsequenceForm {...formProps} app={props.app} />
        ), { key: formKey });
      }}
    />
  );
}
