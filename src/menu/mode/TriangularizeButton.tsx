import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';

interface Props {
  app: App;
}

export function TriangularizeButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'(Un)Flatten Loops'}
      onClick={() => {
        if (!props.app.strictDrawingInteraction.triangularizing()) {
          props.app.strictDrawingInteraction.startTriangularizing();
        }
      }}
      disabled={props.app.strictDrawingInteraction.triangularizing()}
      checked={props.app.strictDrawingInteraction.triangularizing()}
    />
  );
}
