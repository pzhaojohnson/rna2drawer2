import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
const uuidv1 = require('uuid/v1');
import { EditBaseNumbering } from '../../forms/edit/baseNumbering/EditBaseNumbering';

interface Props {
  app: App;
}

export function EditBaseNumberingButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Numbering'}
      onClick={() => {
        props.app.renderForm(() => EditBaseNumbering.create(props.app));
      }}
    />
  );
}
