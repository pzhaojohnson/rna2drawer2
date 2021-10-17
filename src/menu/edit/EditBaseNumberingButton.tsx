import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
import { EditBaseNumbering } from '../../forms/edit/baseNumbering/EditBaseNumbering';

interface Props {
  app: App;
}

export function EditBaseNumberingButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Numbering'}
      onClick={() => {
        props.app.renderForm(close => (
          <EditBaseNumbering
            app={props.app}
            unmount={close}
          />
        ));
      }}
    />
  );
}
