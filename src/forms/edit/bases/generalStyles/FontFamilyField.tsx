import * as React from 'react';
import { AppInterface as App } from '../../../../AppInterface';
import { DrawingInterface as Drawing } from '../../../../draw/DrawingInterface';
import { FontFamilyField as Field } from '../../../fields/font/FontFamilyField';

function getDrawing(app: App): Drawing {
  return app.strictDrawing.drawing;
}

interface Props {
  app: App;
}

export function FontFamilyField(props: Props): React.ReactElement | null {
  if (getDrawing(props.app).numBases == 0) {
    return null;
  } else {
    let first = getDrawing(props.app).getBaseAtOverallPosition(1);
    return (
      <Field
        name='Font'
        initialValue={first ? first.fontFamily : undefined}
        set={ff => {
          if (getDrawing(props.app).numBases > 0) {
            let first = getDrawing(props.app).getBaseAtOverallPosition(1);
            if (!first || ff != first.fontFamily) {
              props.app.pushUndo();
              getDrawing(props.app).forEachBase(b => {
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
