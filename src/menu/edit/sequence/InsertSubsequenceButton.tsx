import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { InsertSubsequence } from 'Forms/edit/sequence/insertSubsequence/InsertSubsequence';
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
          <InsertSubsequence {...formProps} app={props.app} />
        ), { key: formKey });
      }}
    />
  );
}
