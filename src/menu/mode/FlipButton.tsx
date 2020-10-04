import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';

interface Props {
  app: App;
}

export function FlipButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Flip Stems'}
      onClick={() => {
        if (!props.app.strictDrawingInteraction.flipping()) {
          props.app.strictDrawingInteraction.startFlipping();
        }
      }}
      disabled={props.app.strictDrawingInteraction.flipping()}
      checked={props.app.strictDrawingInteraction.flipping()}
    />
  );
}
