import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { NonnegativeNumberField } from '../../fields/text/NonnegativeNumberField';

function getStrokeWidths(app: App): Set<number> {
  let sws = new Set<number>();
  app.strictDrawing.drawing.forEachSecondaryBond(sb => {
    sws.add(sb.strokeWidth);
  });
  return sws;
}

function getFirstStrokeWidth(sws: Set<number>): number | undefined {
  return sws.values().next().value;
}

interface Props {
  app: App;
}

export function StrokeWidthField(props: Props): React.ReactElement {
  let currSws = getStrokeWidths(props.app);
  return (
    <NonnegativeNumberField
      name='Line Width'
      initialValue={currSws.size == 1 ? getFirstStrokeWidth(currSws) : undefined}
      set={sw => {
        if (props.app.strictDrawing.drawing.numSecondaryBonds > 0) {
          let currSws = getStrokeWidths(props.app);
          let first = getFirstStrokeWidth(currSws);
          if (currSws.size != 1 || sw != first) {
            props.app.pushUndo();
            props.app.strictDrawing.drawing.forEachSecondaryBond(sb => {
              sb.strokeWidth = sw;
            });
            props.app.drawingChangedNotByInteraction();
          }
        }
      }}
    />
  );
}
