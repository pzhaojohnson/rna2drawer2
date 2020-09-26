import * as React from 'react';
import NonnegativeNumberField from '../../fields/text/NonnegativeNumberField';
import { getSelectedTertiaryBonds } from './getSelectedTertiaryBonds';
import { AppInterface as App } from '../../../AppInterface';
import { TertiaryBondInterface as TertiaryBond } from '../../../draw/QuadraticBezierBondInterface';
import { areAllSameNumber } from '../../fields/text/areAllSameNumber';

function trimPadding(p: number): number {
  return Number(p.toFixed(2));
}

export function getPadding1s(tbs: TertiaryBond[]): number[] {
  let p1s = [] as number[];
  tbs.forEach(tb => p1s.push(trimPadding(tb.padding1)));
  return p1s;
}

export function getPadding2s(tbs: TertiaryBond[]): number[] {
  let p2s = [] as number[];
  tbs.forEach(tb => p2s.push(trimPadding(tb.padding2)));
  return p2s;
}

interface Props {
  app: App;
}

export function PaddingField1(props: Props): React.ReactElement | null {
  let tbs = getSelectedTertiaryBonds(props.app);
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
          let tbs = getSelectedTertiaryBonds(props.app);
          if (tbs.length > 0) {
            let p1s = getPadding2s(tbs);
            if (!areAllSameNumber(p1s) || p1 != p1s[0]) {
              props.app.pushUndo();
              tbs.forEach(tb => tb.padding1 = p1);
              props.app.drawingChangedNotByInteraction();
            }
          }
        }}
      />
    );
  }
}

export function PaddingField2(props: Props): React.ReactElement | null {
  let tbs = getSelectedTertiaryBonds(props.app);
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
          let tbs = getSelectedTertiaryBonds(props.app);
          if (tbs.length > 0) {
            let p2s = getPadding2s(tbs);
            if (!areAllSameNumber(p2s) || p2 != p2s[0]) {
              props.app.pushUndo();
              tbs.forEach(tb => tb.padding2 = p2);
              props.app.drawingChangedNotByInteraction();
            }
          }
        }}
      />
    );
  }
}
