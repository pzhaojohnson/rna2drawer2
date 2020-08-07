import * as React from 'react';
const uuidv1 = require('uuid/v1');
import DroppedButton from '../DroppedButton';
import App from '../../App';

function onlyAddingTertiaryBonds(app: App): boolean {
  let interaction = app.strictDrawingInteraction;
  let mode = interaction.foldingMode;
  return interaction.folding() && mode.onlyAddingTertiaryBonds();
}

export function AddTertiaryBondsButton(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Add Tertiary Bonds'}
      onClick={() => {
        if (!onlyAddingTertiaryBonds(app)) {
          app.strictDrawingInteraction.startFolding();
          app.strictDrawingInteraction.foldingMode.onlyAddTertiaryBonds();
        }
      }}
      disabled={onlyAddingTertiaryBonds(app)}
      checked={onlyAddingTertiaryBonds(app)}
    />
  );
}

export default AddTertiaryBondsButton;
