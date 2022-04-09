import type { App } from 'App';
import { CircleBaseAnnotation } from 'Draw/bases/annotate/circle/CircleBaseAnnotation';

import * as SVG from '@svgdotjs/svg.js';
import { stroke } from 'Forms/inputs/svg/stroke/stroke';
import { strokeEquals } from 'Forms/inputs/svg/stroke/stroke';
import { setStroke } from 'Forms/inputs/svg/stroke/stroke';

import * as React from 'react';
import { ColorPicker } from 'Forms/inputs/color/ColorPicker';

// returns the circle elements of the outlines
function circles(outlines: CircleBaseAnnotation[]): SVG.Circle[] {
  return outlines.map(outline => outline.circle);
}

export type Props = {

  // a reference to the whole app
  app: App;

  // the outlines to edit
  outlines: CircleBaseAnnotation[];
}

export function StrokePicker(props: Props) {
  return (
    <ColorPicker
      value={stroke(circles(props.outlines))}
      onClose={event => {
        if (!event.target.value) {
          return;
        } else if (strokeEquals(circles(props.outlines), event.target.value.color)) {
          return;
        }

        props.app.pushUndo();
        setStroke(circles(props.outlines), event.target.value.color);
        CircleBaseAnnotation.recommendedDefaults.circle['stroke'] = event.target.value.color.toHex();
        props.app.refresh();
      }}
      disableAlpha={true}
    />
  );
}
