import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
import { EditNumbering } from 'Forms/edit/EditNumbering';

interface Props {
  app: App;
}

export function EditNumberingButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Numbering'}
      onClick={() => {
        props.app.renderForm(close => (
          <EditNumbering
            app={props.app}
            unmount={close}
          />
        ));
      }}
    />
  );
}
