import * as React from 'react';
import NonnegativeNumberField from '../../fields/text/NonnegativeNumberField';
import { AppInterface as App } from '../../../AppInterface';
import { getSelectedTertiaryBonds } from './getSelectedTertiaryBonds';
import { TertiaryBondInterface as TertiaryBond } from '../../../draw/QuadraticBezierBondInterface';
import { areAllSameNumber } from '../../fields/text/areAllSameNumber';

function getStrokeWidths(tbs: TertiaryBond[]): number[] {
  let sws = [] as number[];
  tbs.forEach(tb => sws.push(tb.strokeWidth));
  return sws;
}

interface Props {
  app: App;
}

export function StrokeWidthField(props: Props): React.ReactElement | null {
  let tbs = getSelectedTertiaryBonds(props.app);
  if (tbs.length == 0) {
    return null;
  } else {
    let sws = getStrokeWidths(tbs);
    return (
      <NonnegativeNumberField
        name={'Line Width'}
        initialValue={areAllSameNumber(sws) ? sws[0] : undefined}
        set={sw => {
          let tbs = getSelectedTertiaryBonds(props.app);
          if (tbs.length > 0) {
            let sws = getStrokeWidths(tbs);
            if (!areAllSameNumber(sws) || sw != sws[0]) {
              props.app.pushUndo();
              tbs.forEach(tb => tb.strokeWidth = sw);
              props.app.drawingChangedNotByInteraction();
            }
          }
        }}
      />
    );
  }
}
