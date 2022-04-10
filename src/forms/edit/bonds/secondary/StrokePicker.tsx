import type { App } from 'App';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';

import * as SVG from '@svgdotjs/svg.js';
import { stroke } from 'Forms/inputs/svg/stroke/stroke';
import { strokeEquals } from 'Forms/inputs/svg/stroke/stroke';
import { setStroke } from 'Forms/inputs/svg/stroke/stroke';

import * as React from 'react';
import { ColorPicker } from 'Forms/inputs/color/ColorPicker';

// returns the line elements of the secondary bonds
function lines(secondaryBonds: SecondaryBond[]): SVG.Line[] {
  return secondaryBonds.map(secondaryBond => secondaryBond.line);
}

export type Props = {

  // a reference to the whole app
  app: App;

  // the secondary bonds to edit
  secondaryBonds: SecondaryBond[];
}

export function StrokePicker(props: Props) {
  return (
    <ColorPicker
      value={stroke(lines(props.secondaryBonds))}
      onClose={event => {
        if (!event.target.value) {
          return;
        } else if (strokeEquals(lines(props.secondaryBonds), event.target.value.color)) {
          return;
        }

        props.app.pushUndo();
        setStroke(lines(props.secondaryBonds), event.target.value.color);

        let hex = event.target.value.color.toHex();
        props.secondaryBonds.forEach(secondaryBond => {
          SecondaryBond.recommendedDefaults[secondaryBond.type].line['stroke'] = hex;
        });

        props.app.refresh();
      }}
      disableAlpha={true}
    />
  );
}

export function AUTStrokePicker(props: Props) {
  return (
    <StrokePicker
      app={props.app}
      secondaryBonds={props.secondaryBonds.filter(sb => sb.type == 'AUT')}
    />
  );
}

export function GCStrokePicker(props: Props) {
  return (
    <StrokePicker
      app={props.app}
      secondaryBonds={props.secondaryBonds.filter(sb => sb.type == 'GC')}
    />
  );
}

export function GUTStrokePicker(props: Props) {
  return (
    <StrokePicker
      app={props.app}
      secondaryBonds={props.secondaryBonds.filter(sb => sb.type == 'GUT')}
    />
  );
}

export function OtherStrokePicker(props: Props) {
  return (
    <StrokePicker
      app={props.app}
      secondaryBonds={props.secondaryBonds.filter(sb => sb.type == 'other')}
    />
  );
}
