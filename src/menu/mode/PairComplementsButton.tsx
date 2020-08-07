import * as React from 'react';
const uuidv1 = require('uuid/v1');
import DroppedButton from '../DroppedButton';
import App from '../../App';

function pairingComplements(app: App): boolean {
  let interaction = app.strictDrawingInteraction;
  let mode = interaction.foldingMode;
  return interaction.folding() && mode.pairingComplements();
}

export function PairComplementsButton(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Pair Complements'}
      onClick={() => {
        if (!pairingComplements(app)) {
          app.strictDrawingInteraction.startFolding();
          app.strictDrawingInteraction.foldingMode.pairComplements();
        }
      }}
      disabled={pairingComplements(app)}
      checked={pairingComplements(app)}
    />
  );
}

export default PairComplementsButton;
