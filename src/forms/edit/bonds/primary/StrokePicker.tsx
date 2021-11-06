import * as React from 'react';
import { ColorPicker, Value } from 'Forms/fields/color/ColorPicker';
import { AppInterface as App } from 'AppInterface';
import { PrimaryBondInterface } from 'Draw/bonds/straight/PrimaryBondInterface';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import { parseColor } from 'Parse/svg/color';

export type Props = {
  app: App;

  // the primary bonds to edit
  primaryBonds: PrimaryBondInterface[];
}

// returns undefined for an empty primary bonds array
// or if not all primary bonds have the same stroke
function currStroke(primaryBonds: PrimaryBondInterface[]): Value | undefined {
  let hexs = new Set<string>();
  primaryBonds.forEach(pb => {
    let c = parseColor(pb.line.attr('stroke'));
    if (c) {
      hexs.add(c.toHex().toLowerCase());
    }
  });
  if (hexs.size == 1) {
    let c = parseColor(hexs.values().next().value);
    if (c) {
      return { color: c };
    }
  }
}

function valuesAreEqual(v1?: Value, v2?: Value): boolean {
  if (v1 && v2) {
    return (
      v1.color.toHex().toLowerCase() == v2.color.toHex().toLowerCase()
      && v1.alpha == v2.alpha
    );
  } else {
    return v1 == v2;
  }
}

export function StrokePicker(props: Props) {
  return (
    <ColorPicker
      value={currStroke(props.primaryBonds)}
      onClose={event => {
        if (event.target.value) {
          let value = event.target.value;
          if (!valuesAreEqual(value, currStroke(props.primaryBonds))) {
            props.app.pushUndo();
            props.primaryBonds.forEach(pb => {
              pb.line.attr({ 'stroke': value.color.toHex() });
            });
            PrimaryBond.recommendedDefaults.line['stroke'] = value.color.toHex();
            props.app.refresh();
          }
        }
      }}
      disableAlpha={true}
    />
  );
}
