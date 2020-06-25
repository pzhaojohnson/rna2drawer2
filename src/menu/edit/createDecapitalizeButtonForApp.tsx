import * as React from 'react';
const uuidv1 = require('uuid/v1');
import DroppedButton from '../DroppedButton';
import {
  hasCapitalBaseLetters,
  decapitalizeBaseLetters,
} from '../../draw/edit/capitalize';
import App from '../../App';

export function createCapitalizeButtonForApp(app: App): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'Decapitalize'}
      onClick={() => {
        let drawing = app.strictDrawing.drawing;
        if (!hasCapitalBaseLetters(drawing)) {
          return;
        }
        app.pushUndo();
        decapitalizeBaseLetters(drawing);
        app.drawingChangedNotByInteraction();
      }}
    />
  );
}

export default createCapitalizeButtonForApp;
