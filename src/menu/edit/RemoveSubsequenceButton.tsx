import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
import { RemoveSubsequence } from '../../forms/edit/removeSubsequence/RemoveSubsequence';

interface Props {
  app: App;
}

export function RemoveSubsequenceButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Remove Subsequence'}
      onClick={() => {
        props.app.renderForm(close => (
          <RemoveSubsequence
            app={props.app}
            close={close ? close : () => props.app.unmountCurrForm()}
          />
        ));
      }}
    />
  );
}
