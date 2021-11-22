import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';

function onlyAddingTertiaryBonds(app: App): boolean {
  let interaction = app.strictDrawingInteraction;
  let mode = interaction.foldingMode;
  return interaction.folding() && mode.onlyAddingTertiaryBonds();
}

export type Props = {
  app: App;
}

export function AddTertiaryBondsButton(props: Props) {
  return (
    <DroppedButton
      text='Add Tertiary Bonds'
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
