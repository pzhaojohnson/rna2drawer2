import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import DroppedButton from '../../DroppedButton';
import {
  hasCapitalBaseLetters,
  decapitalizeBaseLetters,
} from '../../../draw/edit/capitalize';

interface Props {
  app: App;
  borderStyle?: string;
  borderWidth?: string;
  borderColor?: string;
}

export function DecapitalizeButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'lowercase'}
      onClick={() => {
        let drawing = props.app.strictDrawing.drawing;
        if (hasCapitalBaseLetters(drawing)) {
          props.app.pushUndo();
          decapitalizeBaseLetters(drawing);
          props.app.drawingChangedNotByInteraction();
        }
      }}
      borderStyle={props.borderStyle}
      borderWidth={props.borderWidth}
      borderColor={props.borderColor}
    />
  );
}
