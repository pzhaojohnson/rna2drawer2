import * as React from 'react';
import NonnegativeNumberField from '../../fields/text/NonnegativeNumberField';
import { TertiaryBondInterface } from 'Draw/bonds/curved/TertiaryBondInterface';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';
import { areAllSameNumber } from '../../fields/text/areAllSameNumber';

export function getStrokeWidths(tbs: TertiaryBondInterface[]): number[] {
  let sws = [] as number[];
  tbs.forEach(tb => {
    let sw = tb.path.attr('stroke-width');
    if (typeof sw == 'number') {
      sws.push(sw);
    }
  });
  return sws;
}

interface Props {
  getTertiaryBonds: () => TertiaryBondInterface[];
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
              tbs.forEach(tb => tb.path.attr({ 'stroke-width': sw }));
              props.changed();
              TertiaryBond.recommendedDefaults.path['stroke-width'] = sw;
            }
          }
        }}
      />
    );
  }
}
