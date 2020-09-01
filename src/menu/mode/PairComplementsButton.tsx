import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
const uuidv1 = require('uuid/v1');

function pairingComplements(app: App): boolean {
  let interaction = app.strictDrawingInteraction;
  let mode = interaction.foldingMode;
  return interaction.folding() && mode.pairingComplements();
}

interface Props {
  app: App;
}

export function PairComplementsButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Pair Complements'}
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
