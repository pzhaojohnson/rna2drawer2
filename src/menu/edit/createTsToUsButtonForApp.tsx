import * as React from 'react';
const uuidv1 = require('uuid/v1');
import DroppedButton from '../DroppedButton';
import App from '../../App';
import {
  hasTs,
  tsToUs,
} from '../../draw/edit/tsAndUs';

export function createTsToUsButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Ts to Us'}
      onClick={() => {
        let drawing = app.strictDrawing.drawing;
        if (!hasTs(drawing)) {
          return;
        }
        app.pushUndo();
        tsToUs(drawing);
        app.drawingChangedNotByInteraction();
      }}
    />
  );
}

export default createTsToUsButtonForApp;
