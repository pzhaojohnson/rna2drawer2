import * as React from 'react';
const uuidv1 = require('uuid/v1');
import DroppedButton from '../DroppedButton';
import App from '../../App';

export function AnnotateButton(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Annotate Bases'}
      onClick={() => {
        if (!app.strictDrawingInteraction.annotating()) {
          app.strictDrawingInteraction.startAnnotating();
        }
      }}
      disabled={app.strictDrawingInteraction.annotating()}
      checked={app.strictDrawingInteraction.annotating()}
    />
  );
}

export default AnnotateButton;
