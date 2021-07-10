import * as React from 'react';
import NonnegativeNumberField from '../../fields/text/NonnegativeNumberField';
import { TertiaryBondInterface } from 'Draw/bonds/curved/TertiaryBondInterface';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';
import { areAllSameNumber } from '../../fields/text/areAllSameNumber';

function trimPadding(p: number): number {
  return Number(p.toFixed(2));
}

export function getPadding1s(tbs: TertiaryBondInterface[]): number[] {
  let p1s = [] as number[];
  tbs.forEach(tb => p1s.push(trimPadding(tb.basePadding1)));
  return p1s;
}

export function getPadding2s(tbs: TertiaryBondInterface[]): number[] {
  let p2s = [] as number[];
  tbs.forEach(tb => p2s.push(trimPadding(tb.basePadding2)));
  return p2s;
}

interface Props {
  getTertiaryBonds: () => TertiaryBondInterface[];
  pushUndo: () => void;
  changed: () => void;
}

export function PaddingField1(props: Props): React.ReactElement | null {
  let tbs = props.getTertiaryBonds();
  if (tbs.length == 0) {
    return null;
  } else {
    let p1s = getPadding1s(tbs);
    return (
      <NonnegativeNumberField
        name={'Base Padding 1'}
        initialValue={areAllSameNumber(p1s) ? p1s[0] : undefined}
        set={p1 => {
          p1 = trimPadding(p1);
          let tbs = props.getTertiaryBonds();
          if (tbs.length > 0) {
            let p1s = getPadding1s(tbs);
            if (!areAllSameNumber(p1s) || p1 != p1s[0]) {
              props.pushUndo();
              tbs.forEach(tb => tb.basePadding1 = p1);
              props.changed();
              TertiaryBond.recommendedDefaults.basePadding1 = p1;
            }
          }
        }}
      />
    );
  }
}

export function PaddingField2(props: Props): React.ReactElement | null {
  let tbs = props.getTertiaryBonds();
  if (tbs.length == 0) {
    return null;
  } else {
    let p2s = getPadding2s(tbs);
    return (
      <NonnegativeNumberField
        name={'Base Padding 2'}
        initialValue={areAllSameNumber(p2s) ? p2s[0] : undefined}
        set={p2 => {
          p2 = trimPadding(p2);
          let tbs = props.getTertiaryBonds();
          if (tbs.length > 0) {
            let p2s = getPadding2s(tbs);
            if (!areAllSameNumber(p2s) || p2 != p2s[0]) {
              props.pushUndo();
              tbs.forEach(tb => tb.basePadding2 = p2);
              props.changed();
              TertiaryBond.recommendedDefaults.basePadding2 = p2;
            }
          }
        }}
      />
    );
  }
}
