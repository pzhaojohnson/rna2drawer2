import * as React from 'react';
import { AppInterface as App } from '../../../../AppInterface';
import { Base } from 'Draw/bases/Base';
import { FontSizeField as Field } from '../../../fields/font/FontSizeField';

interface Props {
  app: App;
}

export function FontSizeField(props: Props): React.ReactElement | null {
  let drawing = props.app.strictDrawing.drawing;
  if (drawing.numBases == 0) {
    return null;
  } else {
    let first = drawing.getBaseAtOverallPosition(1);
    let firstFontSize = first?.text.attr('font-size');
    return (
      <Field
        name='Font Size'
        initialValue={typeof firstFontSize == 'number' ? firstFontSize : undefined}
        set={fs => {
          if (drawing.numBases > 0) {
            let first = drawing.getBaseAtOverallPosition(1);
            if (fs != first?.text.attr('font-size')) {
              props.app.pushUndo();
              drawing.forEachBase(b => {
                
                // remember center coordinates
                let bbox = b.text.bbox();
                let center = { x: bbox.cx, y: bbox.cy};

                b.text.attr({ 'font-size': fs });

                // maintain center coordinates
                b.text.center(center.x, center.y);
                
              });
              props.app.drawingChangedNotByInteraction();
              Base.recommendedDefaults.text['font-size'] = fs;
            }
          }
        }}
      />
    );
  }
}
