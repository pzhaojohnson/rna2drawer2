import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';

export type Props = {
  app: App;
}

export function BySelectionButton(props: Props) {
  return (
    <DroppedButton
      text='By Selection'
      onClick={() => {
        let interaction = props.app.strictDrawingInteraction;
        interaction.startAnnotating();
        interaction.annotatingMode.requestToRenderForm();
      }}
    />
  );
}
