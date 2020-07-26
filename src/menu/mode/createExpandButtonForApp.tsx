import * as React from 'react';
const uuidv1 = require('uuid/v1');
import DroppedButton from '../DroppedButton';
import App from '../../App';

function alreadyExpanding(app: App): boolean {
  let interaction = app.strictDrawingInteraction;
  let pivotingMode = interaction.pivotingMode;
  return interaction.pivoting() && pivotingMode.onlyAddingStretch();
}

function createExpandButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Pivot (Expand)'}
      onClick={() => {
        if (!alreadyExpanding(app)) {
          let interaction = app.strictDrawingInteraction;
          let pivotingMode = interaction.pivotingMode;
          interaction.startPivoting();
          pivotingMode.onlyAddStretch();
        }
      }}
      disabled={alreadyExpanding(app)}
      checked={alreadyExpanding(app)}
    />
  );
}

export default createExpandButtonForApp;
