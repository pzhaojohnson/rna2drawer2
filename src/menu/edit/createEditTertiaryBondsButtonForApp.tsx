import * as React from 'react';
const uuidv1 = require('uuid/v1');

import DroppedButton from '../DroppedButton';

import EditTertiaryBond from '../../forms/edit/tertiaryBonds/EditTertiaryBond';
import App from '../../App';

export function createEditTertiaryBondsButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Tertiary Bonds'}
      onClick={() => app.renderForm(() => EditTertiaryBond.create(app))}
    />
  );
}

export default createEditTertiaryBondsButtonForApp;
