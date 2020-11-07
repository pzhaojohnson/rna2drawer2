import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import { DroppedButton } from '../DroppedButton';
import { EditSecondaryBonds } from '../../forms/edit/secondaryBonds/EditSecondaryBonds';

interface Props {
  app: App;
}

export function EditSecondaryBondsButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text='Secondary Bonds'
      onClick={() => {
        props.app.renderForm(close => (
          <EditSecondaryBonds
            app={props.app}
            close={close ? close : () => props.app.unmountCurrForm()}
          />
        ))
      }}
    />
  );
}
