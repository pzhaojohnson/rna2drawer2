import * as React from 'react';
import { ColorPicker, Value } from 'Forms/inputs/color/ColorPicker';
import type { App } from 'App';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';
import { interpretColor } from 'Draw/svg/interpretColor';

export type Props = {
  app: App;

  // the tertiary bonds to edit
  tertiaryBonds: TertiaryBond[];
}

// returns undefined for an empty tertiary bonds array
// or if not all tertiary bonds have the same stroke
function currStroke(tertiaryBonds: TertiaryBond[]): Value | undefined {
  let hexs = new Set<string>();
  tertiaryBonds.forEach(tb => {
    let c = interpretColor(tb.path.attr('stroke'));
    if (c) {
      hexs.add(c.toHex().toLowerCase());
    }
  });
  if (hexs.size == 1) {
    let hex = hexs.values().next().value;
    let c = interpretColor(hex);
    if (c) {
      return { color: c };
    }
  }
}

function areEqual(v1?: Value, v2?: Value): boolean {
  if (v1 && v2) {
    return (
      v1.color.toHex().toLowerCase() == v2.color.toHex().toLowerCase()
      && v1.alpha == v2.alpha
    );
  } else {
    return v1 == v2;
  }
}

function hasFill(tb: TertiaryBond): boolean {
  let f = tb.path.attr('fill');
  if (typeof f == 'string') {
    f = f.trim().toLowerCase();
    return f != '' && f != 'none';
  } else {
    return false;
  }
}

export function StrokePicker(props: Props) {
  return (
    <ColorPicker
      value={currStroke(props.tertiaryBonds)}
      onClose={event => {
        if (event.target.value) {
          let value = event.target.value;
          if (!areEqual(value, currStroke(props.tertiaryBonds))) {
            props.app.pushUndo();
            let hex = value.color.toHex();
            props.tertiaryBonds.forEach(tb => {
              tb.path.attr({ 'stroke': hex });
              if (hasFill(tb)) {
                tb.path.attr({ 'fill': hex });
              }
            });
            TertiaryBond.recommendedDefaults.path['stroke'] = hex;
            props.app.refresh();
          }
        }
      }}
      disableAlpha={true}
    />
  );
}
