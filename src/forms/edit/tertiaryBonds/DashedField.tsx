import * as React from 'react';
import { CheckboxField } from '../../fields/checkbox/CheckboxField';
import { TertiaryBondInterface } from 'Draw/bonds/curved/TertiaryBondInterface';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

export function isDashed(tb: TertiaryBondInterface): boolean {
  let sda = tb.path.attr('stroke-dasharray');
  if (typeof sda == 'string') {
    sda = sda.trim().toLowerCase();
  }
  return sda != '' && sda != 'none';
}

export function areAllDashed(tbs: TertiaryBondInterface[]): boolean {
  let allDashed = true;
  tbs.forEach(tb => {
    if (!isDashed(tb)) {
      allDashed = false;
    }
  });
  return allDashed;
}

export function areAllNotDashed(tbs: TertiaryBondInterface[]): boolean {
  let allNotDashed = true;
  tbs.forEach(tb => {
    if (isDashed(tb)) {
      allNotDashed = false;
    }
  });
  return allNotDashed;
}

interface Props {
  getTertiaryBonds: () => TertiaryBondInterface[];
  pushUndo: () => void;
  changed: () => void;
}

export function DashedField(props: Props): React.ReactElement | null {
  if (props.getTertiaryBonds().length == 0) {
    return null;
  } else {
    return (
      <CheckboxField
        name={'Dashed'}
        initialValue={areAllDashed(props.getTertiaryBonds())}
        set={b => {
          let tbs = props.getTertiaryBonds();
          if (tbs.length > 0) {
            let shouldDash = b && !areAllDashed(tbs);
            let shouldUndash = !b && !areAllNotDashed(tbs);
            if (shouldDash || shouldUndash) {
              props.pushUndo();
              let sda = b ? TertiaryBond.dashedStrokeDasharray : '';
              tbs.forEach(tb => {
                tb.path.attr({ 'stroke-dasharray': sda });
              });
              props.changed();
              TertiaryBond.recommendedDefaults.path['stroke-dasharray'] = sda;
            }
          }
        }}
      />
    );
  }
}
