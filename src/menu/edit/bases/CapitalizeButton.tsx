import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import DroppedButton from '../../DroppedButton';
import {
  onlyHasCapitalBaseLetters,
  capitalizeBaseLetters,
} from '../../../draw/edit/capitalize';

interface Props {
  app: App;
  borderStyle?: string;
  borderWidth?: string;
  borderColor?: string;
}

export function CapitalizeButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'UPPERCASE'}
      onClick={() => {
        let drawing = props.app.strictDrawing.drawing;
        if (!onlyHasCapitalBaseLetters(drawing)) {
          props.app.pushUndo();
          capitalizeBaseLetters(drawing);
          props.app.drawingChangedNotByInteraction();
        }
      }}
      borderStyle={props.borderStyle}
      borderWidth={props.borderWidth}
      borderColor={props.borderColor}
    />
  );
}
