import * as React from 'react';
import { AppInterface as App } from '../../../../AppInterface';
import { FontSizeField as Field } from '../../../fields/font/FontSizeField';

interface Props {
  app: App;
}

export function FontSizeField(props: Props): React.ReactElement | null {
  let drawing = props.app.strictDrawing.drawing;
  if (drawing.numBases == 0) {
    return null;
  } else {
    let first = drawing.getBaseAtOverallPosition(1);
    return (
      <Field
        name='Font Size'
        initialValue={first?.fontSize}
        set={fs => {
          if (drawing.numBases > 0) {
            let first = drawing.getBaseAtOverallPosition(1);
            if (fs != first?.fontSize) {
              props.app.pushUndo();
              drawing.forEachBase(b => {
                b.fontSize = fs;
              });
              props.app.drawingChangedNotByInteraction();
            }
          }
        }}
      />
    );
  }
}
