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
                b.text.attr({ 'font-family': ff });
              });
              props.app.drawingChangedNotByInteraction();
            }
          }
        }}
      />
    );
  }
}
