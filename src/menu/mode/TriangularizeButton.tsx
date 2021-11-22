import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';

export type Props = {
  app: App;
}

export function TriangularizeButton(props: Props) {
  return (
    <DroppedButton
      text='Flatten and Unflatten Loops'
      onClick={() => {
        if (!props.app.strictDrawingInteraction.triangularizing()) {
          props.app.strictDrawingInteraction.startTriangularizing();
        }
      }}
      disabled={props.app.strictDrawingInteraction.triangularizing()}
      checked={props.app.strictDrawingInteraction.triangularizing()}
    />
  );
}
