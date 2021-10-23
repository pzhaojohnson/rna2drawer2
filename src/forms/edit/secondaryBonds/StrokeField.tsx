import * as React from 'react';
import { ColorPicker, Value } from 'Forms/fields/color/ColorPicker';
import colorFieldStyles from 'Forms/fields/color/ColorField.css';
import { AppInterface as App } from 'AppInterface';
import { SecondaryBondInterface } from 'Draw/bonds/straight/SecondaryBondInterface';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { parseColor } from 'Parse/svg/color';

// returns undefined for an empty secondary bonds array
// or if not all secondary bonds have the same stroke
function currStroke(secondaryBonds: SecondaryBondInterface[]): Value | undefined {
  let hexs = new Set<string>();
  secondaryBonds.forEach(sb => {
    let c = parseColor(sb.line.attr('stroke'));
    if (c) {
      hexs.add(c.toHex().toLowerCase());
    }
  });
  if (hexs.size == 1) {
    let c = parseColor(hexs.values().next().value);
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

type StrokeFieldProps = {
  app: App;

  // the secondary bonds to edit
  secondaryBonds: SecondaryBondInterface[];

  name: string;
}

function StrokeField(props: StrokeFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
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
              props.app.drawingChangedNotByInteraction();
            }
          }
        }}
        disableAlpha={true}
      />
      <p
        className={`${colorFieldStyles.label} unselectable`}
        style={{ marginLeft: '8px' }}
      >
        {props.name}
      </p>
    </div>
  );
}

export type Props = {
  app: App;

  // the secondary bonds to edit
  secondaryBonds: SecondaryBondInterface[];
}

export function AUTStrokeField(props: Props) {
  return (
    <StrokeField
      app={props.app}
      secondaryBonds={props.secondaryBonds.filter(sb => sb.type == 'AUT')}
      name='AU and AT Color'
    />
  );
}

export function GCStrokeField(props: Props) {
  return (
    <StrokeField
      app={props.app}
      secondaryBonds={props.secondaryBonds.filter(sb => sb.type == 'GC')}
      name='GC Color'
    />
  );
}

export function GUTStrokeField(props: Props) {
  return (
    <StrokeField
      app={props.app}
      secondaryBonds={props.secondaryBonds.filter(sb => sb.type == 'GUT')}
      name='GU and GT Color'
    />
  );
}

export function OtherStrokeField(props: Props) {
  return (
    <StrokeField
      app={props.app}
      secondaryBonds={props.secondaryBonds.filter(sb => sb.type == 'other')}
      name='Noncanonical Color'
    />
  );
}
