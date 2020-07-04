import * as React from 'react';
const uuidv1 = require('uuid/v1');

import DroppedButton from '../DroppedButton';

import App from '../../App';
import EditBaseNumbering from '../../forms/edit/baseNumbering/EditBaseNumbering';

export function createEditBaseNumberingButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Numbering'}
      onClick={() => app.renderForm(() => EditBaseNumbering.create(app))}
    />
  );
}

export default createEditBaseNumberingButtonForApp;
