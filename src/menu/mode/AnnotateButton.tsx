import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';

interface Props {
  app: App;
}

export function AnnotateButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Annotate Bases'}
      onClick={() => {
        if (!props.app.strictDrawingInteraction.annotating()) {
          props.app.strictDrawingInteraction.startAnnotating();
        }
      }}
      disabled={props.app.strictDrawingInteraction.annotating()}
      checked={props.app.strictDrawingInteraction.annotating()}
    />
  );
}
