import * as React from 'react';
const uuidv1 = require('uuid/v1');
import DroppedButton from '../DroppedButton';
import App from '../../App';

function forcePairing(app: App): boolean {
  let interaction = app.strictDrawingInteraction;
  let mode = interaction.foldingMode;
  return interaction.folding() && mode.forcePairing();
}

export function ForcePairButton(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Force Pair'}
      onClick={() => {
        if (!forcePairing(app)) {
          app.strictDrawingInteraction.startFolding();
          app.strictDrawingInteraction.foldingMode.forcePair();
        }
      }}
      disabled={forcePairing(app)}
      checked={forcePairing(app)}
    />
  );
}

export default ForcePairButton;
