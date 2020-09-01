import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
const uuidv1 = require('uuid/v1');

interface Props {
  app: App;
}

export function RedoButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Redo'}
      onClick={() => props.app.redo()}
      disabled={!props.app.canRedo()}
      keyBinding={'Ctrl+Shift+Z'}
    />
  );
}
