import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';

export type Props = {
  app: App;
}

export function UndoButton(props: Props) {
  return (
    <DroppedButton
      text='Undo'
      onClick={() => props.app.undo()}
      disabled={!props.app.canUndo()}
      keyBinding='Ctrl+Z'
    />
  );
}
