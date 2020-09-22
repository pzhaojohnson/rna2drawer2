import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
import { InsertSubsequence } from '../../forms/edit/insertSubsequence/InsertSubsequence';

interface Props {
  app: App;
}

export function InsertSubsequenceButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Insert Subsequence'}
      onClick={() => {
        props.app.renderForm(close => (
          <InsertSubsequence
            app={props.app}
            close={close ? close : () => props.app.unmountCurrForm()}
          />
        ));
      }}
    />
  );
}
