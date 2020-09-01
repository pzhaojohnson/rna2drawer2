import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';

function forcePairing(app: App): boolean {
  let interaction = app.strictDrawingInteraction;
  let mode = interaction.foldingMode;
  return interaction.folding() && mode.forcePairing();
}

interface Props {
  app: App;
}

export function ForcePairButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Force Pair'}
      onClick={() => {
        if (!forcePairing(props.app)) {
          props.app.strictDrawingInteraction.startFolding();
          props.app.strictDrawingInteraction.foldingMode.forcePair();
        }
      }}
      disabled={forcePairing(props.app)}
      checked={forcePairing(props.app)}
    />
  );
}
