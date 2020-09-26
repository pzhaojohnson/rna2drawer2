import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
import { EditTertiaryBonds } from '../../forms/edit/tertiaryBonds/EditTertiaryBonds';

interface Props {
  app: App;
}

export function EditTertiaryBondsButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Tertiary Bonds'}
      onClick={() => {
        props.app.renderForm(close => (
          <EditTertiaryBonds app={props.app} close={close ? close : () => props.app.unmountCurrForm()} />
        ));
      }}
    />
  );
}
