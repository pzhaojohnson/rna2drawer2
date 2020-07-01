import * as React from 'react';
const uuidv1 = require('uuid/v1');

import DroppedButton from '../DroppedButton';

import renderEditLayoutInApp from '../../forms/edit/layout/renderEditLayoutInApp';
import App from '../../App';

function createEditLayoutButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Layout'}
      onClick={() => renderEditLayoutInApp(app)}
    />
  );
}

export default createEditLayoutButtonForApp;
