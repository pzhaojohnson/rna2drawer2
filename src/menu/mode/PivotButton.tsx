import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';

function alreadyPivoting(app: App): boolean {
  let interaction = app.strictDrawingInteraction;
  let pivotingMode = interaction.pivotingMode;
  return interaction.pivoting() && pivotingMode.addingAndRemovingStretch();
}

export type Props = {
  app: App;
}

export function PivotButton(props: Props) {
  return (
    <DroppedButton
      text='Drag Stems'
      onClick={() => {
        if (!alreadyPivoting(props.app)) {
          let interaction = props.app.strictDrawingInteraction;
          let pivotingMode = interaction.pivotingMode;
          interaction.startPivoting();
          pivotingMode.addAndRemoveStretch();
        }
      }}
      disabled={alreadyPivoting(props.app)}
      checked={alreadyPivoting(props.app)}
    />
  );
}
