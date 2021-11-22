import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';

function pairingComplements(app: App): boolean {
  let interaction = app.strictDrawingInteraction;
  let mode = interaction.foldingMode;
  return interaction.folding() && mode.pairingComplements();
}

export type Props = {
  app: App;
}

export function PairComplementsButton(props: Props) {
  return (
    <DroppedButton
      text='Pair Complements'
      onClick={() => {
        if (!pairingComplements(props.app)) {
          props.app.strictDrawingInteraction.startFolding();
          props.app.strictDrawingInteraction.foldingMode.pairComplements();
        }
      }}
      disabled={pairingComplements(props.app)}
      checked={pairingComplements(props.app)}
    />
  );
}
