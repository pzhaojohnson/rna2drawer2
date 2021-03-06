import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import DroppedButton from '../../DroppedButton';
import {
  hasUs,
  usToTs,
} from '../../../draw/edit/tsAndUs';

interface Props {
  app: App;
  borderStyle?: string;
  borderWidth?: string;
  borderColor?: string;
}

export function UsToTsButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Us to Ts'}
      onClick={() => {
        let drawing = props.app.strictDrawing.drawing;
        if (!hasUs(drawing)) {
          return;
        }
        props.app.pushUndo();
        usToTs(drawing);
        props.app.drawingChangedNotByInteraction();
      }}
      borderStyle={props.borderStyle}
      borderWidth={props.borderWidth}
      borderColor={props.borderColor}
    />
  );
}
