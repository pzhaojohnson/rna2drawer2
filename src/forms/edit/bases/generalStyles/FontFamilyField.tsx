import * as React from 'react';
import { AppInterface as App } from '../../../../AppInterface';
import { FontFamilyField as Field } from '../../../fields/font/FontFamilyField';

interface Props {
  app: App;
}

export function FontFamilyField(props: Props): React.ReactElement | null {
  let drawing = props.app.strictDrawing.drawing;
  if (drawing.numBases == 0) {
    return null;
  } else {
    let first = drawing.getBaseAtOverallPosition(1);
    return (
      <Field
        name='Font'
        initialValue={first?.fontFamily}
        set={ff => {
          if (drawing.numBases > 0) {
            let first = drawing.getBaseAtOverallPosition(1);
            if (ff != first?.fontFamily) {
              props.app.pushUndo();
              drawing.forEachBase(b => {
                b.fontFamily = ff;
              });
              props.app.drawingChangedNotByInteraction();
            }
          }
        }}
      />
    );
  }
}
