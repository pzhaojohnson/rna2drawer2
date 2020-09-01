import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
const uuidv1 = require('uuid/v1');
import { EditTertiaryBond } from '../../forms/edit/tertiaryBonds/EditTertiaryBond';

interface Props {
  app: App;
}

export function EditTertiaryBondsButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Tertiary Bonds'}
      onClick={() => {
        props.app.renderForm(() => EditTertiaryBond.create(props.app));
      }}
    />
  );
}
