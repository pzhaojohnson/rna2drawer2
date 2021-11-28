import * as React from 'react';
import { useEffect } from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';

export type Props = {
  app: App;
}

function undoIfCan(app: App) {
  if (app.canUndo()) {
    app.undo();
  }
}

export function UndoButton(props: Props) {
  useEffect(() => {
    let listener = (event: KeyboardEvent) => {
      let key = event.key;
      key = key.toLowerCase();
      // must check shift key since Ctrl+Shift+Z is redo
      if (key == 'z' && event.ctrlKey && !event.shiftKey) {
        undoIfCan(props.app);
      }
    };
    
    document.addEventListener('keyup', listener);
    return () => document.removeEventListener('keyup', listener);
  });

  return (
    <DroppedButton
      text='Undo'
      onClick={() => undoIfCan(props.app)}
      disabled={!props.app.canUndo()}
      keyBinding='Ctrl+Z'
    />
  );
}
