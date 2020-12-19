import * as React from 'react';
import { AppInterface as App } from '../../../../AppInterface';
import { isBold } from '../../../fields/font/isBold';
import { CheckboxField } from '../../../fields/checkbox/CheckboxField';

interface Props {
  app: App;
}

export function BoldFontField(props: Props): React.ReactElement | null {
  let drawing = props.app.strictDrawing.drawing;
  if (drawing.numBases == 0) {
    return null;
  } else {
    let first = drawing.getBaseAtOverallPosition(1);
    return (
      <CheckboxField
        name='Bold'
        initialValue={first ? isBold(first.fontWeight) : false}
        set={shouldBeBold => {
          if (drawing.numBases > 0) {
            let first = drawing.getBaseAtOverallPosition(1);
            let firstIsBold = first ? isBold(first.fontWeight) : false;
            if (shouldBeBold != firstIsBold || !first) {
              props.app.pushUndo();
              drawing.forEachBase(b => {
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
