import * as React from 'react';
const uuidv1 = require('uuid/v1');
import DroppedButton from '../DroppedButton';
import App from '../../App';
import EditSequenceId from '../../forms/edit/sequenceId/EditSequenceId';

export function createEditSequenceIdButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Sequence ID'}
      onClick={() => app.renderForm(() => EditSequenceId.create(app))}
    />
  );
}

export default createEditSequenceIdButtonForApp;
