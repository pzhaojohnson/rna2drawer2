import * as React from 'react';
import { ColorPicker as UnderlyingColorPicker, Value } from 'Forms/inputs/color/ColorPicker';
import type { App } from 'App';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';
import { interpretColor } from 'Draw/svg/interpretColor';

export type Props = {
  app: App;

  // the base numberings to edit
  baseNumberings: BaseNumbering[];
}

// returns undefined for an empty base numberings array
// or if not all base numbering texts and lines have the same color
function currColor(baseNumberings: BaseNumbering[]): Value | undefined {
  let hexs = new Set<string>();
  baseNumberings.forEach(bn => {
    let textColor = interpretColor(bn.text.attr('fill'));
    if (textColor) {
      hexs.add(textColor.toHex().toLowerCase());
    }
    let lineColor = interpretColor(bn.line.attr('stroke'));
    if (lineColor) {
      hexs.add(lineColor.toHex().toLowerCase());
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

export function ColorPicker(props: Props) {
  return (
    <UnderlyingColorPicker
      value={currColor(props.baseNumberings)}
      onClose={event => {
        if (event.target.value) {
          let value = event.target.value;
          if (!areEqual(value, currColor(props.baseNumberings))) {
            props.app.pushUndo();
            let hex = value.color.toHex();
            props.baseNumberings.forEach(bn => {
              bn.text.attr({ 'fill': hex });
              bn.line.attr({ 'stroke': hex });
            });
            BaseNumbering.recommendedDefaults.text['fill'] = hex;
            BaseNumbering.recommendedDefaults.line['stroke'] = hex;
            props.app.refresh();
          }
        }
      }}
      disableAlpha={true}
    />
  );
}
