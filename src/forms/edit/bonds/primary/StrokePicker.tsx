import type { App } from 'App';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';

import * as SVG from '@svgdotjs/svg.js';
import { stroke } from 'Forms/inputs/svg/stroke/stroke';
import { strokeEquals } from 'Forms/inputs/svg/stroke/stroke';
import { setStroke } from 'Forms/inputs/svg/stroke/stroke';

import * as React from 'react';
import { ColorPicker } from 'Forms/inputs/color/ColorPicker';

// returns the line elements of the primary bonds
function lines(primaryBonds: PrimaryBond[]): SVG.Line[] {
  return primaryBonds.map(primaryBond => primaryBond.line);
}

export type Props = {

  // a reference to the whole app
  app: App;

  // the primary bonds to edit
  primaryBonds: PrimaryBond[];
}

export function StrokePicker(props: Props) {
  return (
    <ColorPicker
      value={stroke(lines(props.primaryBonds))}
      onClose={event => {
        if (!event.target.value) {
          return;
        } else if (strokeEquals(lines(props.primaryBonds), event.target.value.color)) {
          return;
        }

        props.app.pushUndo();
        setStroke(lines(props.primaryBonds), event.target.value.color);
        PrimaryBond.recommendedDefaults.line['stroke'] = event.target.value.color.toHex();
        props.app.refresh();
      }}
      disableAlpha={true}
    />
  );
}
