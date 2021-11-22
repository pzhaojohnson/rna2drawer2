import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';

export type Props = {
  app: App;
}

export function RedoButton(props: Props) {
  return (
    <DroppedButton
      text='Redo'
      onClick={() => props.app.redo()}
      disabled={!props.app.canRedo()}
      keyBinding='Ctrl+Shift+Z'
    />
  );
}
