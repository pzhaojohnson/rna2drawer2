import * as React from 'react';
const uuidv1 = require('uuid/v1');

import DroppedButton from '../DroppedButton';

import EditLayout from '../../forms/edit/layout/EditLayout';
import App from '../../App';

function createEditLayoutButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Layout'}
      onClick={() => app.renderForm(() => EditLayout.create(app))}
    />
  );
}

export default createEditLayoutButtonForApp;
