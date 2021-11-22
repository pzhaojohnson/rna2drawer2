import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';

export type Props = {
  app: App;
}

export function FlipButton(props: Props) {
  return (
    <DroppedButton
      text='Flip Stems'
      onClick={() => {
        if (!props.app.strictDrawingInteraction.flipping()) {
          props.app.strictDrawingInteraction.startFlipping();
        }
      }}
      disabled={props.app.strictDrawingInteraction.flipping()}
      checked={props.app.strictDrawingInteraction.flipping()}
    />
  );
}
