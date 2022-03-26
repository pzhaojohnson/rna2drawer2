import * as React from 'react';
import { ColorPicker, Value } from 'Forms/inputs/color/ColorPicker';
import type { App } from 'App';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { interpretColor } from 'Draw/svg/interpretColor';

// returns undefined for an empty secondary bonds array
// or if not all secondary bonds have the same stroke
function currStroke(secondaryBonds: SecondaryBond[]): Value | undefined {
  let hexs = new Set<string>();
  secondaryBonds.forEach(sb => {
    let c = interpretColor(sb.line.attr('stroke'));
    if (c) {
      hexs.add(c.toHex().toLowerCase());
    }
  });
  if (hexs.size == 1) {
    let c = interpretColor(hexs.values().next().value);
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

export type Props = {
  app: App;

  // the secondary bonds to edit
  secondaryBonds: SecondaryBond[];
}

export function StrokePicker(props: Props) {
  return (
    <ColorPicker
      value={currStroke(props.secondaryBonds)}
      onClose={event => {
        if (event.target.value) {
          let value = event.target.value;
          if (!valuesAreEqual(value, currStroke(props.secondaryBonds))) {
            props.app.pushUndo();
            let hex = value.color.toHex();
            props.secondaryBonds.forEach(sb => {
              sb.line.attr({ 'stroke': hex });
              SecondaryBond.recommendedDefaults[sb.type].line['stroke'] = hex;
            });
            props.app.refresh();
          }
        }
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
