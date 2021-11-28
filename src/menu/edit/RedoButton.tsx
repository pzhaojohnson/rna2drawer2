import * as React from 'react';
import { useEffect } from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';

export type Props = {
  app: App;
}

function redoIfCan(app: App) {
  if (app.canRedo()) {
    app.redo();
  }
}

export function RedoButton(props: Props) {
  useEffect(() => {
    let listener = (event: KeyboardEvent) => {
      let key = event.key;
      key = key.toLowerCase();
      if (key == 'z' && event.ctrlKey && event.shiftKey) {
        redoIfCan(props.app);
      }
    };
    
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  });

  return (
    <DroppedButton
      text='Redo'
      onClick={() => redoIfCan(props.app)}
      disabled={!props.app.canRedo()}
      keyBinding='Ctrl+Shift+Z'
    />
  );
}
