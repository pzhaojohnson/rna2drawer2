import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
const uuidv1 = require('uuid/v1');
import { EditSequenceId } from '../../forms/edit/sequenceId/EditSequenceId';

interface Props {
  app: App;
}

export function EditSequenceIdButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Sequence ID'}
      onClick={() => {
        props.app.renderForm(() => EditSequenceId.create(props.app));
      }}
    />
  );
}
