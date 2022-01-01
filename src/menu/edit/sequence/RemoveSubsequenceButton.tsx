import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { RemoveSubsequence } from 'Forms/edit/sequence/removeSubsequence/RemoveSubsequence';
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
          <RemoveSubsequence {...formProps} app={props.app} />
        ), { key: formKey });
      }}
    />
  );
}
