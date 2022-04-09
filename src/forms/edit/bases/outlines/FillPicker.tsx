import type { App } from 'App';
import { CircleBaseAnnotation } from 'Draw/bases/annotate/circle/CircleBaseAnnotation';

import * as SVG from '@svgdotjs/svg.js';
import { fill } from 'Forms/inputs/svg/fill/fill';
import { fillEquals } from 'Forms/inputs/svg/fill/fill';
import { setFill } from 'Forms/inputs/svg/fill/fill';

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

export function FillPicker(props: Props) {
  return (
    <ColorPicker
      value={fill(circles(props.outlines))}
      onClose={event => {
        if (!event.target.value) {
          return;
        } else if (fillEquals(circles(props.outlines), event.target.value.color)) {
          return;
        }

        props.app.pushUndo();
        setFill(circles(props.outlines), event.target.value.color);
        CircleBaseAnnotation.recommendedDefaults.circle['fill'] = event.target.value.color.toHex();
        props.app.refresh();
      }}
      disableAlpha={true}
    />
  );
}
