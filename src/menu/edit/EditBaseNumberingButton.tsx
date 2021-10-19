import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
import { EditBaseNumberings } from 'Forms/edit/baseNumberings/EditBaseNumberings';

interface Props {
  app: App;
}

export function EditBaseNumberingButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Numbering'}
      onClick={() => {
        props.app.renderForm(close => (
          <EditBaseNumberings
            app={props.app}
            unmount={close}
          />
        ));
      }}
    />
  );
}
