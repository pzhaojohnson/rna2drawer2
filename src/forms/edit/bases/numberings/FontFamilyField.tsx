import * as React from 'react';
import { FontFamilySelect } from 'Forms/fields/font/FontFamilySelect';
import type { App } from 'App';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';

export type Props = {
  app: App;

  // the base numberings to edit
  baseNumberings: BaseNumbering[];
}

// returns undefined for an empty base numberings array
// or if not all base numberings have the same font family
function currFontFamily(baseNumberings: BaseNumbering[]): string | undefined {
  let ffs = new Set<string>();
  baseNumberings.forEach(bn => {
    let ff = bn.text.attr('font-family');
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
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }} >
      <FontFamilySelect
        value={currFontFamily(props.baseNumberings)}
        onChange={event => {
          if (event.target.value != currFontFamily(props.baseNumberings)) {
            props.app.pushUndo();
            props.baseNumberings.forEach(bn => {
              bn.text.attr({ 'font-family': event.target.value });
              bn.reposition();
            });
            BaseNumbering.recommendedDefaults.text['font-family'] = event.target.value;
            props.app.refresh();
          }
        }}
      />
    </div>
  );
}
