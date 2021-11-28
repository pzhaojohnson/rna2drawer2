import * as React from 'react';
import { useEffect } from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { detectMacOS } from 'Utilities/detectMacOS';

export type Props = {
  app: App;
}

function redoIfCan(app: App) {
  if (app.canRedo()) {
    app.redo();
  }
}

function isCtrlShiftZ(event: KeyboardEvent): boolean {
  return (
    event.key.toLowerCase() == 'z'
    && event.ctrlKey
    && event.shiftKey
  );
}

function isMetaShiftZ(event: KeyboardEvent): boolean {
  return (
    event.key.toLowerCase() == 'z'
    && event.metaKey
    && event.shiftKey
  );
}

export function RedoButton(props: Props) {
  useEffect(() => {
    let listener = (event: KeyboardEvent) => {
      if (!event.repeat) {
        if (isCtrlShiftZ(event) || (detectMacOS() && isMetaShiftZ(event))) {
          redoIfCan(props.app);
        }
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
      keyBinding={detectMacOS() ? '⇧ ⌘ Z' : 'Ctrl+Shift+Z'}
    />
  );
}
