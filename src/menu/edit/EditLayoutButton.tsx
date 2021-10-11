import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
import { EditLayout } from 'Forms/edit/layout/EditLayout';

interface Props {
  app: App;
}

export function EditLayoutButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Layout'}
      onClick={() => {
        props.app.renderForm(close => (
          <EditLayout app={props.app} unmount={close} />
        ));
      }}
    />
  );
}
