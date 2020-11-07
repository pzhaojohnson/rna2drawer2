import * as React from 'react';
import { AppInterface as App } from '../../../../AppInterface';
import { DrawingInterface as Drawing } from '../../../../draw/DrawingInterface';
import { isBold } from '../../../fields/font/isBold';
import { CheckboxField } from '../../../fields/CheckboxField';

function getDrawing(app: App): Drawing {
  return app.strictDrawing.drawing;
}

function allAreBold(drawing: Drawing): boolean {
  let allBold = true;
  drawing.forEachBase(b => {
    if (!isBold(b.fontWeight)) {
      allBold = false;
    }
  });
  return allBold;
}

function allAreNotBold(drawing: Drawing): boolean {
  let allNotBold = true;
  drawing.forEachBase(b => {
    if (isBold(b.fontWeight)) {
      allNotBold = false;
    }
  });
  return allNotBold;
}

interface Props {
  app: App;
}

export function BoldFontField(props: Props): React.ReactElement | null {
  if (getDrawing(props.app).numBases == 0) {
    return null;
  } else {
    return (
      <CheckboxField
        name='Bold'
        initialValue={allAreBold(getDrawing(props.app))}
        set={shouldBeBold => {
          if (getDrawing(props.app).numBases > 0) {
            let allBold = allAreBold(getDrawing(props.app));
            let allNotBold = allAreNotBold(getDrawing(props.app));
            if ((shouldBeBold && !allBold) || (!shouldBeBold && !allNotBold)) {
              props.app.pushUndo();
              getDrawing(props.app).forEachBase(b => {
                b.fontWeight = shouldBeBold ? 'bold' : 'normal';
              });
              props.app.drawingChangedNotByInteraction();
            }
          }
        }}
      />
    );
  }
}
