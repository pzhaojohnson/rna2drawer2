import * as React from 'react';
const uuidv1 = require('uuid/v1');
import DroppedButton from '../DroppedButton';
import { renderEditSequenceIdInApp } from '../../forms/renderEditSequenceIdInApp';
import App from '../../App';

export function createEditSequenceIdButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Sequence ID'}
      onClick={() => renderEditSequenceIdInApp(app)}
    />
  );
}

export default createEditSequenceIdButtonForApp;
