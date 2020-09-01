import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';

interface Props {
  app: App;
}

export function UndoButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Undo'}
      onClick={() => props.app.undo()}
      disabled={!props.app.canUndo()}
      keyBinding={'Ctrl+Z'}
    />
  );
}
