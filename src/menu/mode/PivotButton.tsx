import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';

function alreadyPivoting(app: App): boolean {
  let interaction = app.strictDrawingInteraction;
  let pivotingMode = interaction.pivotingMode;
  return interaction.pivoting() && pivotingMode.addingAndRemovingStretch();
}

interface Props {
  app: App;
}

export function PivotButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Drag Stems'}
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
