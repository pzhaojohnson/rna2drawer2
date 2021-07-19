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
    let firstFontFamily = first?.text.attr('font-family');
    return (
      <Field
        name='Font'
        initialValue={typeof firstFontFamily == 'string' ? firstFontFamily : undefined}
        set={ff => {
          if (drawing.numBases > 0) {
            let first = drawing.getBaseAtOverallPosition(1);
            if (ff != first?.text.attr('font-family')) {
              props.app.pushUndo();
              drawing.forEachBase(b => {
                let bbox = b.text.bbox();
                let center = { x: bbox.cx, y: bbox.cy };
                b.text.attr({ 'font-family': ff });
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
