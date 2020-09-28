import * as React from 'react';
import NonnegativeNumberField from '../../fields/text/NonnegativeNumberField';
import { TertiaryBondInterface as TertiaryBond } from '../../../draw/QuadraticBezierBondInterface';
import { areAllSameNumber } from '../../fields/text/areAllSameNumber';

function getStrokeWidths(tbs: TertiaryBond[]): number[] {
  let sws = [] as number[];
  tbs.forEach(tb => sws.push(tb.strokeWidth));
  return sws;
}

interface Props {
  getTertiaryBonds: () => TertiaryBond[];
  pushUndo: () => void;
  changed: () => void;
}

export function StrokeWidthField(props: Props): React.ReactElement | null {
  let tbs = props.getTertiaryBonds();
  if (tbs.length == 0) {
    return null;
  } else {
    let sws = getStrokeWidths(tbs);
    return (
      <NonnegativeNumberField
        name={'Line Width'}
        initialValue={areAllSameNumber(sws) ? sws[0] : undefined}
        set={sw => {
          let tbs = props.getTertiaryBonds();
          if (tbs.length > 0) {
            let sws = getStrokeWidths(tbs);
            if (!areAllSameNumber(sws) || sw != sws[0]) {
              props.pushUndo();
              tbs.forEach(tb => tb.strokeWidth = sw);
              props.changed();
            }
          }
        }}
      />
    );
  }
}
