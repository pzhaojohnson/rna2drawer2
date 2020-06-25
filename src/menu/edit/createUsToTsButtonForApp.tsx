import * as React from 'react';
const uuidv1 = require('uuid/v1');
import DroppedButton from '../DroppedButton';
import App from '../../App';
import {
  hasUs,
  usToTs,
} from '../../draw/edit/tsAndUs';

export function createTsToUsButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Us to Ts'}
      onClick={() => {
        let drawing = app.strictDrawing.drawing;
        if (!hasUs(drawing)) {
          return;
        }
        app.pushUndo();
        usToTs(drawing);
        app.drawingChangedNotByInteraction();
      }}
    />
  );
}

export default createTsToUsButtonForApp;
