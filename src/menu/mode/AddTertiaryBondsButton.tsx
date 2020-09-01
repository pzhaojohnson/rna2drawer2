import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';

function onlyAddingTertiaryBonds(app: App): boolean {
  let interaction = app.strictDrawingInteraction;
  let mode = interaction.foldingMode;
  return interaction.folding() && mode.onlyAddingTertiaryBonds();
}

interface Props {
  app: App;
}

export function AddTertiaryBondsButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Add Tertiary Bonds'}
      onClick={() => {
        if (!onlyAddingTertiaryBonds(props.app)) {
          props.app.strictDrawingInteraction.startFolding();
          props.app.strictDrawingInteraction.foldingMode.onlyAddTertiaryBonds();
        }
      }}
      disabled={onlyAddingTertiaryBonds(props.app)}
      checked={onlyAddingTertiaryBonds(props.app)}
    />
  );
}
