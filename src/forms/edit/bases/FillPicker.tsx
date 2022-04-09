import type { App } from 'App';
import type { Base } from 'Draw/bases/Base';

import * as SVG from '@svgdotjs/svg.js';
import { fill } from 'Forms/inputs/svg/fill/fill';
import { fillEquals } from 'Forms/inputs/svg/fill/fill';

import * as React from 'react';
import { ColorPicker } from 'Forms/inputs/color/ColorPicker';

// returns the text elements of the bases
function texts(bases: Base[]): SVG.Text[] {
  return bases.map(base => base.text);
}

export type Props = {

  // a reference to the whole app
  app: App;

  // the bases to edit
  bases: Base[];
}

export function FillPicker(props: Props) {
  return (
    <ColorPicker
      value={fill(texts(props.bases))}
      onClose={event => {
        if (!event.target.value) {
          return;
        } else if (fillEquals(texts(props.bases), event.target.value.color)) {
          return;
        }

        props.app.pushUndo();
        let hex = event.target.value.color.toHex();
        props.bases.forEach(b => {
          b.text.attr({ 'fill': hex });
        });
        props.app.refresh();
      }}
      disableAlpha={true}
    />
  );
}
