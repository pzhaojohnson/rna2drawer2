import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
const uuidv1 = require('uuid/v1');

interface Props {
  app: App;
}

export function AnnotateButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
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
