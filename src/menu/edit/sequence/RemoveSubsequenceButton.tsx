import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { RemoveSubsequenceForm } from 'Forms/edit/sequences/subsequences/remove/RemoveSubsequenceForm';
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
      style={{ borderRadius: '0px 0px 4px 4px' }}
    />
  );
}
