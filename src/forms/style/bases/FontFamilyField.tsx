import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { DrawingInterface as Drawing } from '../../../draw/DrawingInterface';
import { FontFamilyField as Field } from '../../fields/font/FontFamilyField';

function getDrawing(app: App): Drawing {
  return app.strictDrawing.drawing;
}

function getFontFamilies(drawing: Drawing): Set<string> {
  let ffs = new Set<string>();
  drawing.forEachBase(b => {
    ffs.add(b.fontFamily);
  });
  return ffs;
}

function getInitialValue(drawing: Drawing): string | undefined {
  let ffs = getFontFamilies(drawing);
  if (ffs.size == 1) {
    return ffs.values().next().value;
  }
}

interface Props {
  app: App;
}

export function FontFamilyField(props: Props): React.ReactElement | null {
  if (getDrawing(props.app).numBases == 0) {
    return null;
  } else {
    return (
      <Field
        name='Font'
        initialValue={getInitialValue(getDrawing(props.app))}
        set={ff => {
          if (getDrawing(props.app).numBases > 0) {
            if (ff != getInitialValue(getDrawing(props.app))) {
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
