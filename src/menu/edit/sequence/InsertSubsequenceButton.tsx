import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { InsertSubsequence } from 'Forms/edit/sequence/insertSubsequence/InsertSubsequence';

export type Props = {
  app: App;
}

export function InsertSubsequenceButton(props: Props) {
  return (
    <DroppedButton
      text='Insert Subsequence'
      onClick={() => {
        props.app.formContainer.renderForm(formProps => (
          <InsertSubsequence app={props.app} unmount={formProps.unmount} />
        ));
      }}
    />
  );
}
