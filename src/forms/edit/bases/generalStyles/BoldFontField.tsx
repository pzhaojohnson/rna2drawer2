import * as React from 'react';
import { AppInterface as App } from '../../../../AppInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { isBold } from '../../../fields/font/isBold';
import { CheckboxField } from '../../../fields/checkbox/CheckboxField';

function baseIsBold(b: Base): boolean {
  let fw = b.text.attr('font-weight');
  if (typeof fw == 'string' || typeof fw == 'number') {
    return isBold(fw);
  } else {
    return false;
  }
}

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
        initialValue={first ? baseIsBold(first) : false}
        set={shouldBeBold => {
          if (drawing.numBases > 0) {
            let first = drawing.getBaseAtOverallPosition(1);
            let firstIsBold = first ? baseIsBold(first) : false;
            if (shouldBeBold != firstIsBold || !first) {
              props.app.pushUndo();
              drawing.forEachBase(b => {
                let bbox = b.text.bbox();
                let center = { x: bbox.cx, y: bbox.cy };
                b.text.attr({ 'font-weight': shouldBeBold ? 'bold' : 'normal' });
                b.text.center(center.x, center.y);
              });
              props.app.drawingChangedNotByInteraction();
            }
          }
        }}
      />
    );
  }
}
