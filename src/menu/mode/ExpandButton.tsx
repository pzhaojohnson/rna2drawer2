import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';

function alreadyExpanding(app: App): boolean {
  let interaction = app.strictDrawingInteraction;
  let pivotingMode = interaction.pivotingMode;
  return interaction.pivoting() && pivotingMode.onlyAddingStretch();
}

export type Props = {
  app: App;
}

export function ExpandButton(props: Props) {
  return (
    <DroppedButton
      text='Drag Stems (Expand)'
      onClick={() => {
        if (!alreadyExpanding(props.app)) {
          let interaction = props.app.strictDrawingInteraction;
          let pivotingMode = interaction.pivotingMode;
          interaction.startPivoting();
          pivotingMode.onlyAddStretch();
        }
      }}
      disabled={alreadyExpanding(props.app)}
      checked={alreadyExpanding(props.app)}
    />
  );
}
