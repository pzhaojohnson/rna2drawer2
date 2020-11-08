import * as React from 'react';
import { AppInterface as App } from '../../../../AppInterface';
import { DrawingInterface as Drawing } from '../../../../draw/DrawingInterface';
import { FontSizeField as Field } from '../../../fields/font/FontSizeField';

function getDrawing(app: App): Drawing {
  return app.strictDrawing.drawing;
}

interface Props {
  app: App;
}

export function FontSizeField(props: Props): React.ReactElement | null {
  if (getDrawing(props.app).numBases == 0) {
    return null;
  } else {
    let first = getDrawing(props.app).getBaseAtOverallPosition(1);
    return (
      <Field
        name='Font Size'
        initialValue={first ? first.fontSize : undefined}
        set={fs => {
          if (getDrawing(props.app).numBases > 0) {
            let first = getDrawing(props.app).getBaseAtOverallPosition(1);
            if (!first || fs != first.fontSize) {
              props.app.pushUndo();
              getDrawing(props.app).forEachBase(b => {
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
