import * as React from 'react';
import { FontFamilySelect } from 'Forms/fields/font/FontFamilySelect';
import { AppInterface as App } from 'AppInterface';
import { BaseInterface } from 'Draw/bases/BaseInterface';
import { Base } from 'Draw/bases/Base';

export type Props = {
  app: App;

  // the bases to edit
  bases: BaseInterface[];
}

// returns undefined for an empty bases array
// or if not all bases have the same font family
function currFontFamily(bases: BaseInterface[]): string | undefined {
  let ffs = new Set<string>();
  bases.forEach(b => {
    let ff = b.text.attr('font-family');
    if (typeof ff == 'string') {
      ffs.add(ff);
    }
  });
  if (ffs.size == 1) {
    return ffs.values().next().value;
  }
}

export function FontFamilyField(props: Props) {
  return (
    <div style={{ width: '232px' }} >
      <FontFamilySelect
        value={currFontFamily(props.bases)}
        onChange={event => {
          if (event.target.value != currFontFamily(props.bases)) {
            props.app.pushUndo();

            props.bases.forEach(b => {

              // remember center coordinates
              let bbox = b.text.bbox();
              let center = { x: bbox.cx, y: bbox.cy };

              b.text.attr({ 'font-family': event.target.value });

              // recenter
              b.text.center(center.x, center.y);
            });

            Base.recommendedDefaults.text['font-family'] = event.target.value;
            props.app.refresh();
          }
        }}
        styles={{ container: { minWidth: '232px' } }}
      />
    </div>
  );
}
