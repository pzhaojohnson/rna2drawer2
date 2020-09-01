import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
const uuidv1 = require('uuid/v1');
import EditLayout from '../../forms/edit/layout/EditLayout';

interface Props {
  app: App;
}

export function EditLayoutButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Layout'}
      onClick={() => {
        props.app.renderForm(() => EditLayout.create(props.app));
      }}
    />
  );
}
