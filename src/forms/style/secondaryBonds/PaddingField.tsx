import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { NonnegativeNumberField } from '../../fields/text/NonnegativeNumberField';

function getPaddings(app: App): Set<number> {
  let ps = new Set<number>();
  app.strictDrawing.drawing.forEachSecondaryBond(sb => {
    ps.add(sb.padding1);
  });
  return ps;
}

function getFirstPadding(ps: Set<number>): number | undefined {
  return ps.values().next().value;
}

interface Props {
  app: App;
}

export function PaddingField(props: Props): React.ReactElement {
  let currPs = getPaddings(props.app);
  return (
    <NonnegativeNumberField
      name='Padding'
      initialValue={currPs.size == 1 ? getFirstPadding(currPs) : undefined}
      set={p => {
        if (props.app.strictDrawing.drawing.numSecondaryBonds > 0) {
          let currPs = getPaddings(props.app);
          let first = getFirstPadding(currPs);
          if (currPs.size != 1 || p != first) {
            props.app.pushUndo();
            props.app.strictDrawing.drawing.forEachSecondaryBond(sb => {
              sb.padding1 = p;
              sb.padding2 = p;
            });
            props.app.drawingChangedNotByInteraction();
          }
        }
      }}
    />
  );
}
