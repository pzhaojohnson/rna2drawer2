import * as React from 'react';
import { FontFamilySelect } from 'Forms/fields/font/FontFamilySelect';
import { AppInterface as App } from 'AppInterface';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';

// returns undefined if there are no base numberings in the drawing
// or if base numberings do not all have the same font family
function currFontFamilyOfBaseNumberings(drawing: Drawing): string | undefined {
  let ffs = new Set<string>();
  drawing.bases().forEach(b => {
    if (b.numbering) {
      let ff = b.numbering.text.attr('font-family');
      if (typeof ff == 'string') {
        ffs.add(ff);
      }
    }
  });
  if (ffs.size == 1) {
    return ffs.values().next().value;
  }
}

export type Props = {
  app: App;
}

export function FontFamilyField(props: Props) {
  return (
    <div style={{ width: '232px' }} >
      <FontFamilySelect
        value={currFontFamilyOfBaseNumberings(props.app.strictDrawing.drawing)}
        onChange={event => {
          if (event.target.value != currFontFamilyOfBaseNumberings(props.app.strictDrawing.drawing)) {
            props.app.pushUndo();
            props.app.strictDrawing.drawing.bases().forEach(b => {
              if (b.numbering) {
                b.numbering.text.attr({ 'font-family': event.target.value });
                b.numbering.reposition();
              }
            });
            BaseNumbering.recommendedDefaults.text['font-family'] = event.target.value;
            props.app.drawingChangedNotByInteraction();
          }
        }}
        styles={{ container: { minWidth: '232px' } }}
      />
    </div>
  );
}
