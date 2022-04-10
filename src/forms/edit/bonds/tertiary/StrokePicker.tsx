import type { App } from 'App';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

import * as SVG from '@svgdotjs/svg.js';
import { stroke } from 'Forms/inputs/svg/stroke/stroke';
import { strokeEquals } from 'Forms/inputs/svg/stroke/stroke';
import { setStroke } from 'Forms/inputs/svg/stroke/stroke';

import * as React from 'react';
import { ColorPicker } from 'Forms/inputs/color/ColorPicker';

// returns the path elements of the tertiary bonds
function paths(tertiaryBonds: TertiaryBond[]): SVG.Path[] {
  return tertiaryBonds.map(bond => bond.path);
}

export type Props = {

  // a reference to the whole app
  app: App;

  // the tertiary bonds to edit
  tertiaryBonds: TertiaryBond[];
}

export function StrokePicker(props: Props) {
  return (
    <ColorPicker
      value={stroke(paths(props.tertiaryBonds))}
      onClose={event => {
        if (!event.target.value) {
          return;
        } else if (strokeEquals(paths(props.tertiaryBonds), event.target.value.color)) {
          return;
        }

        props.app.pushUndo();
        setStroke(paths(props.tertiaryBonds), event.target.value.color);
        TertiaryBond.recommendedDefaults.path['stroke'] = event.target.value.color.toHex();
        props.app.refresh();
      }}
      disableAlpha={true}
    />
  );
}
