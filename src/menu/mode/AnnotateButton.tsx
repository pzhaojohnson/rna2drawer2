import * as React from 'react';
import { AppInterface as App } from 'AppInterface';
import { DroppedButton } from 'Menu/DroppedButton';

export type Props = {
  app: App;
}

export function AnnotateButton(props: Props) {
  return (
    <DroppedButton
      text='Edit Bases'
      onClick={() => {
        let interaction = props.app.strictDrawingInteraction;
        if (!interaction.annotating()) {
          interaction.startAnnotating();
        }
      }}
      disabled={props.app.strictDrawingInteraction.annotating()}
      checked={props.app.strictDrawingInteraction.annotating()}
    />
  );
}
