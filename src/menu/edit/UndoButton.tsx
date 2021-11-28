import * as React from 'react';
import { useEffect } from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { detectMacOS } from 'Utilities/detectMacOS';

export type Props = {
  app: App;
}

function undoIfCan(app: App) {
  if (app.canUndo()) {
    app.undo();
  }
}

function isCtrlZ(event: KeyboardEvent): boolean {
  return (
    event.key.toLowerCase() == 'z'
    && event.ctrlKey
    && !event.shiftKey // with shift key is for redo
  );
}

function isMetaZ(event: KeyboardEvent): boolean {
  return (
    event.key.toLowerCase() == 'z'
    && event.metaKey
    && !event.shiftKey // with shift key is for redo
  );
}

export function UndoButton(props: Props) {
  useEffect(() => {
    let listener = (event: KeyboardEvent) => {
      if (!event.repeat) {
        if (isCtrlZ(event) || (detectMacOS() && isMetaZ(event))) {
          undoIfCan(props.app);
        }
      }
    };

    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  });

  return (
    <DroppedButton
      text='Undo'
      onClick={() => undoIfCan(props.app)}
      disabled={!props.app.canUndo()}
      keyBinding={detectMacOS() ? '⌘ Z' : 'Ctrl+Z'}
    />
  );
}
