import * as React from 'react';
import { ColorField, ColorAndOpacity } from '../../fields/color/ColorField';
import { TertiaryBondInterface as TertiaryBond, TertiaryBondInterface } from 'Draw/bonds/curved/QuadraticBezierBondInterface';
import { parseColor } from '../../../parse/parseColor';

export function getColorsAndOpacities(tbs: TertiaryBond[]): ColorAndOpacity[] {
  let cos = [] as ColorAndOpacity[];
  tbs.forEach(tb => {
    let c = parseColor(tb.stroke);
    if (c) {
      cos.push({ color: c.toHex(), opacity: tb.strokeOpacity });
    }
  });
  return cos;
}

export function areSameColorAndOpacity(co1?: ColorAndOpacity, co2?: ColorAndOpacity): boolean {
  if (co1 && co2) {
    return co1.color.toLowerCase() == co2.color.toLowerCase() && co1.opacity == co2.opacity;
  } else {
    return false;
  }
}

export function areAllSameColorAndOpacity(cos: ColorAndOpacity[]): boolean {
  let allSame = true;
  let first = cos[0];
  cos.forEach(co => {
    if (!areSameColorAndOpacity(first, co)) {
      allSame = false;
    }
  });
  return allSame;
}

export function hasFill(tb: TertiaryBond): boolean {
  let f = tb.fill.trim().toLowerCase();
  return f != '' && f != 'none';
}

interface Props {
  getTertiaryBonds: () => TertiaryBond[];
  pushUndo: () => void;
  changed: () => void;
}

export function StrokeField(props: Props): React.ReactElement | null {
  let tbs = props.getTertiaryBonds();
  if (tbs.length == 0) {
    return null;
  } else {
    let cos = getColorsAndOpacities(tbs);
    return (
      <ColorField
        name={'Color'}
        initialValue={areAllSameColorAndOpacity(cos) ? cos[0] : undefined}
        set={co => {
          let tbs = props.getTertiaryBonds();
          if (tbs.length > 0) {
            let cos = getColorsAndOpacities(tbs);
            if (!areAllSameColorAndOpacity(cos) || !areSameColorAndOpacity(co, cos[0])) {
              props.pushUndo();
              tbs.forEach(tb => {
                tb.stroke = co.color;
                tb.strokeOpacity = co.opacity;
                if (hasFill(tb)) {
                  tb.fill = co.color;
                  tb.fillOpacity = Math.max(0.1 * tb.strokeOpacity, 0.05);
                }
              });
              props.changed();
            }
          }
        }}
      />
    );
  }
}
