import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { DrawingInterface as Drawing } from '../../../draw/DrawingInterface';
import { FontSizeField as Field } from '../../fields/font/FontSizeField';

function getDrawing(app: App): Drawing {
  return app.strictDrawing.drawing;
}

function getFontSizes(drawing: Drawing): Set<number> {
  let fss = new Set<number>();
  drawing.forEachBase(b => {
    fss.add(b.fontSize);
  });
  return fss;
}

function getInitialValue(drawing: Drawing): number | undefined {
  let fss = getFontSizes(drawing);
  if (fss.size == 1) {
    return fss.values().next().value;
  }
}

interface Props {
  app: App;
}

export function FontSizeField(props: Props): React.ReactElement | null {
  if (getDrawing(props.app).numBases == 0) {
    return null;
  } else {
    return (
      <Field
        name='Font Size'
        initialValue={getInitialValue(getDrawing(props.app))}
        set={fs => {
          if (getDrawing(props.app).numBases > 0) {
            if (fs != getInitialValue(getDrawing(props.app))) {
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
