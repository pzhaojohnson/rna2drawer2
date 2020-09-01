import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
import {
  hasCapitalBaseLetters,
  decapitalizeBaseLetters,
} from '../../draw/edit/capitalize';

interface Props {
  app: App;
}

export function DecapitalizeButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Decapitalize'}
      onClick={() => {
        let drawing = props.app.strictDrawing.drawing;
        if (hasCapitalBaseLetters(drawing)) {
          props.app.pushUndo();
          decapitalizeBaseLetters(drawing);
          props.app.drawingChangedNotByInteraction();
        }
      }}
    />
  );
}
