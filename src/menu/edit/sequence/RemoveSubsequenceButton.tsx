import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import DroppedButton from '../../DroppedButton';
import { RemoveSubsequence } from '../../../forms/edit/sequence/removeSubsequence/RemoveSubsequence';

interface Props {
  app: App;
  borderStyle?: string;
  borderWidth?: string;
  borderColor?: string;
}

export function RemoveSubsequenceButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Remove Subsequence'}
      onClick={() => {
        props.app.renderForm(close => (
          <RemoveSubsequence
            app={props.app}
            unmount={close}
          />
        ));
      }}
      borderStyle={props.borderStyle}
      borderWidth={props.borderWidth}
      borderColor={props.borderColor}
    />
  );
}
