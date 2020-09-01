import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
const uuidv1 = require('uuid/v1');

function alreadyExpanding(app: App): boolean {
  let interaction = app.strictDrawingInteraction;
  let pivotingMode = interaction.pivotingMode;
  return interaction.pivoting() && pivotingMode.onlyAddingStretch();
}

interface Props {
  app: App;
}

export function ExpandButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Pivot (Expand)'}
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
