import * as React from 'react';
import { ColorField, ColorAndOpacity } from '../../fields/color/ColorField';
import { TertiaryBondInterface } from 'Draw/bonds/curved/TertiaryBondInterface';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';
import { parseColor } from '../../../parse/parseColor';

export function getColorsAndOpacities(tbs: TertiaryBondInterface[]): ColorAndOpacity[] {
  let cos = [] as ColorAndOpacity[];
  tbs.forEach(tb => {
    let c = parseColor(tb.path.attr('stroke'));
    let o = tb.path.attr('stroke-opacity');
    if (c && typeof o == 'number') {
      cos.push({ color: c.toHex(), opacity: o });
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

export function hasFill(tb: TertiaryBondInterface): boolean {
  let f = tb.fill.trim().toLowerCase();
  return f != '' && f != 'none';
}

interface Props {
  getTertiaryBonds: () => TertiaryBondInterface[];
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
                tb.path.attr({
                  'stroke': co.color,
                  'stroke-opacity': co.opacity,
                });
                if (hasFill(tb)) {
                  tb.fill = co.color;
                  tb.fillOpacity = Math.max(0.1 * co.opacity, 0.05);
                }
              });
              props.changed();
              TertiaryBond.recommendedDefaults.path['stroke'] = co.color;
              TertiaryBond.recommendedDefaults.path['stroke-opacity'] = co.opacity;
            }
          }
        }}
      />
    );
  }
}
