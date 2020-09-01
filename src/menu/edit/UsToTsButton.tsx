import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
const uuidv1 = require('uuid/v1');
import {
  hasUs,
  usToTs,
} from '../../draw/edit/tsAndUs';

interface Props {
  app: App;
}

export function UsToTsButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
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
    />
  );
}
