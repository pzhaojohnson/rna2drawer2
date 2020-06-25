import * as React from 'react';
const uuidv1 = require('uuid/v1');
import DroppedButton from '../DroppedButton';
import {
  onlyHasCapitalBaseLetters,
  capitalizeBaseLetters,
} from '../../draw/edit/capitalize';
import App from '../../App';

export function createCapitalizeButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Capitalize'}
      onClick={() => {
        let drawing = app.strictDrawing.drawing;
        if (onlyHasCapitalBaseLetters(drawing)) {
          return;
        }
        app.pushUndo();
        capitalizeBaseLetters(drawing);
        app.drawingChangedNotByInteraction();
      }}
    />
  );
}

export default createCapitalizeButtonForApp;
