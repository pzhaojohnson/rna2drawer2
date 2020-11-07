import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import { DroppedButton } from '../DroppedButton';
import { EditPrimaryBonds } from '../../forms/edit/primaryBonds/EditPrimaryBonds';

interface Props {
  app: App;
}

export function EditPrimaryBondsButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text='Primary Bonds'
      onClick={() => {
        props.app.renderForm(close => (
          <EditPrimaryBonds
            app={props.app}
            close={close ? close : () => props.app.unmountCurrForm()}
          />
        ))
      }}
    />
  );
}
