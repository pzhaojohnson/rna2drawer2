import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import DroppedButton from '../../DroppedButton';
import { EditSequenceId } from 'Forms/edit/sequence/EditSequenceId';

interface Props {
  app: App;
}

export function EditSequenceIdButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Sequence ID'}
      onClick={() => {
        props.app.renderForm(close => (
          <EditSequenceId
            app={props.app}
            unmount={close}
          />
        ));
      }}
    />
  );
}
