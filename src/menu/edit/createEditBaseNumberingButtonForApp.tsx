import * as React from 'react';
const uuidv1 = require('uuid/v1');

import DroppedButton from '../DroppedButton';

import renderEditBaseNumberingInApp from '../../forms/renderEditBaseNumberingInApp';
import App from '../../App';

export function createEditBaseNumberingButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Numbering'}
      onClick={() => renderEditBaseNumberingInApp(app)}
    />
  );
}

export default createEditBaseNumberingButtonForApp;
