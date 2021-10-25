import * as React from 'react';
import { useState } from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import { AppInterface as App } from 'AppInterface';
import { PrimaryBondInterface } from 'Draw/bonds/straight/PrimaryBondInterface';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import { parseNumber } from 'Parse/svg/number';
import { round } from 'Math/round';

export type Props = {
  app: App;

  // the primary bonds to edit
  primaryBonds: PrimaryBondInterface[];
}

// returns an empty string for an empty primary bonds array
// or if not all primary bonds have the same stroke opacity
function currStrokeOpacityPercentage(primaryBonds: PrimaryBondInterface[]): string {
  let sops = new Set<number>();
  primaryBonds.forEach(pb => {
    let so = pb.line.attr('stroke-opacity');
    let n = parseNumber(so);
    if (n) {
      let sop = 100 * n.valueOf();
      sops.add(round(sop, 0));
    }
  });
  if (sops.size == 1) {
    return sops.values().next().value + '%';
  } else {
    return '';
  }
}

function valueIsValid(value: string): boolean {
  let n = Number.parseFloat(value);
  return Number.isFinite(n);
}

function valuesAreEqual(value1: string, value2: string): boolean {
  return Number.parseFloat(value1) == Number.parseFloat(value2);
}

// converts values less than 0 to 0 and greater than 1 to 1
function clampOpacity(o: number): number {
  if (o < 0) {
    return 0;
  } else if (o > 1) {
    return 1;
  } else {
    return o;
  }
}

function setStrokeOpacitiesIfShould(props: Props, value: string) {
  if (valueIsValid(value)) {
    if (!valuesAreEqual(value, currStrokeOpacityPercentage(props.primaryBonds))) {
      props.app.pushUndo();
      let sop = Number.parseFloat(value);
      let so = sop / 100;
      so = clampOpacity(so);
      so = round(so, 4);
      props.primaryBonds.forEach(pb => {
        pb.line.attr({ 'stroke-opacity': so });
      });
      PrimaryBond.recommendedDefaults.line['stroke-opacity'] = so;
      props.app.drawingChangedNotByInteraction();
    }
  }
}

export function StrokeOpacityInput(props: Props) {
  let [value, setValue] = useState(currStrokeOpacityPercentage(props.primaryBonds));
  return (
    <input
      type='text'
      className={textFieldStyles.input}
      value={value}
      onChange={event => setValue(event.target.value)}
      onBlur={() => {
        setStrokeOpacitiesIfShould(props, value);
        props.app.drawingChangedNotByInteraction();
      }}
      onKeyUp={event => {
        if (event.key.toLowerCase() == 'enter') {
          setStrokeOpacitiesIfShould(props, value);
          props.app.drawingChangedNotByInteraction();
        }
      }}
      style={{ width: '32px', textAlign: 'end' }}
    />
  );
}
