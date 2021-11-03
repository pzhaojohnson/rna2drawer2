import * as React from 'react';
import { ColorPicker, Value } from 'Forms/fields/color/ColorPicker';
import { AppInterface as App } from 'AppInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { parseColor } from 'Parse/svg/color';

export type Props = {
  app: App;

  // the bases to edit
  bases: Base[];
}

// returns undefined for an empty bases array
// or if not all bases have the same fill
function currFill(bases: Base[]): Value | undefined {
  let hexs = new Set<string>();
  bases.forEach(b => {
    let c = parseColor(b.text.attr('fill'));
    if (c) {
      hexs.add(c.toHex().toLowerCase());
    }
  });
  if (hexs.size == 1) {
    let hex = hexs.values().next().value;
    let c = parseColor(hex);
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

export function FillPicker(props: Props) {
  return (
    <ColorPicker
      value={currFill(props.bases)}
      onClose={event => {
        if (event.target.value) {
          let value = event.target.value;
          if (!areEqual(value, currFill(props.bases))) {
            props.app.pushUndo();
            props.bases.forEach(b => {
              b.text.attr({ 'fill': value.color.toHex() });
            });
            props.app.refresh();
          }
        }
      }}
      disableAlpha={true}
    />
  );
}
