import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { InsertSubsequenceForm } from 'Forms/edit/sequence/insertSubsequence/InsertSubsequenceForm';
import { v4 as uuidv4 } from 'uuid';

export type Props = {
  app: App;
}

const formKey = uuidv4();

export function InsertSubsequenceButton(props: Props) {
  return (
    <DroppedButton
      text='Insert Subsequence'
      onClick={() => {
        props.app.formContainer.renderForm(formProps => (
          <InsertSubsequenceForm {...formProps} app={props.app} />
        ), { key: formKey });
      }}
    />
  );
}
