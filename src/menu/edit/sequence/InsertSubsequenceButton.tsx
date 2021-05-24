import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import DroppedButton from '../../DroppedButton';
import { InsertSubsequence } from '../../../forms/edit/sequence/insertSubsequence/InsertSubsequence';

interface Props {
  app: App;
  borderStyle?: string;
  borderWidth?: string;
  borderColor?: string;
}

export function InsertSubsequenceButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Insert Subsequence'}
      onClick={() => {
        props.app.renderForm(close => (
          <InsertSubsequence
            app={props.app}
            close={close}
          />
        ));
      }}
      borderStyle={props.borderStyle}
      borderWidth={props.borderWidth}
      borderColor={props.borderColor}
    />
  );
}
