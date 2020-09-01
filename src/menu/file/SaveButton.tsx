import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
const uuidv1 = require('uuid/v1');

interface Props {
  app: App;
}

export function SaveButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Save'}
      onClick={() => props.app.save()}
      disabled={props.app.strictDrawing.isEmpty()}
    />
  );
}
