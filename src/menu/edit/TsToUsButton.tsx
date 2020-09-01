import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
import {
  hasTs,
  tsToUs,
} from '../../draw/edit/tsAndUs';

interface Props {
  app: App;
}

export function TsToUsButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'Ts to Us'}
      onClick={() => {
        let drawing = props.app.strictDrawing.drawing;
        if (!hasTs(drawing)) {
          return;
        }
        props.app.pushUndo();
        tsToUs(drawing);
        props.app.drawingChangedNotByInteraction();
      }}
    />
  );
}
