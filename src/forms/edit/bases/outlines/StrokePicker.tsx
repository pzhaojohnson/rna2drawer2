import * as React from 'react';
import { ColorPicker, Value } from 'Forms/fields/color/ColorPicker';
import { AppInterface as App } from 'AppInterface';
import { CircleBaseAnnotationInterface } from 'Draw/bases/annotate/circle/CircleBaseAnnotationInterface';
import { CircleBaseAnnotation } from 'Draw/bases/annotate/circle/CircleBaseAnnotation';
import { interpretColor } from 'Draw/svg/interpretColor';

export type Props = {
  app: App;

  // the outlines to edit
  outlines: CircleBaseAnnotationInterface[];
}

// returns undefined for an empty outlines array
// or if not all outlines have the same stroke
function currStroke(outlines: CircleBaseAnnotationInterface[]): Value | undefined {
  let hexs = new Set<string>();
  outlines.forEach(o => {
    let s = o.circle.attr('stroke');
    let c = interpretColor(s);
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

export function StrokePicker(props: Props) {
  return (
    <ColorPicker
      value={currStroke(props.outlines)}
      onClose={event => {
        if (event.target.value) {
          let value = event.target.value;
          if (!areEqual(value, currStroke(props.outlines))) {
            props.app.pushUndo();
            let hex = value.color.toHex();
            props.outlines.forEach(o => {
              o.circle.attr({ 'stroke': hex });
            });
            CircleBaseAnnotation.recommendedDefaults.circle['stroke'] = hex;
            props.app.refresh();
          }
        }
      }}
      disableAlpha={true}
    />
  );
}
