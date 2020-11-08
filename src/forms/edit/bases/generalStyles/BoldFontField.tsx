import * as React from 'react';
import { AppInterface as App } from '../../../../AppInterface';
import { DrawingInterface as Drawing } from '../../../../draw/DrawingInterface';
import { isBold } from '../../../fields/font/isBold';
import { CheckboxField } from '../../../fields/CheckboxField';

function getDrawing(app: App): Drawing {
  return app.strictDrawing.drawing;
}

interface Props {
  app: App;
}

export function BoldFontField(props: Props): React.ReactElement | null {
  if (getDrawing(props.app).numBases == 0) {
    return null;
  } else {
    let first = getDrawing(props.app).getBaseAtOverallPosition(1);
    return (
      <CheckboxField
        name='Bold'
        initialValue={first ? isBold(first.fontWeight) : false}
        set={shouldBeBold => {
          if (getDrawing(props.app).numBases > 0) {
            let first = getDrawing(props.app).getBaseAtOverallPosition(1);
            let firstIsBold = first ? isBold(first.fontWeight) : false;
            if (!first || shouldBeBold != firstIsBold) {
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
