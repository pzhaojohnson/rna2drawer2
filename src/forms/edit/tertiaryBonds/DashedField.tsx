import * as React from 'react';
import CheckboxField from '../../fields/CheckboxField';
import { AppInterface as App } from '../../../AppInterface';
import { TertiaryBondInterface } from '../../../draw/QuadraticBezierBondInterface';
import { TertiaryBond } from '../../../draw/QuadraticBezierBond';

function getSelected(app: App): TertiaryBondInterface[] {
  let drawing = app.strictDrawing.drawing;
  let interaction = app.strictDrawingInteraction.tertiaryBondsInteraction;
  return drawing.getTertiaryBondsByIds(interaction.selected);
}

export function isDashed(tb: TertiaryBondInterface): boolean {
  let sda = tb.strokeDasharray.trim().toLowerCase();
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
  app: App;
}

export function DashedField(props: Props): React.ReactElement | null {
  if (getSelected(props.app).length == 0) {
    return null;
  } else {
    return (
      <CheckboxField
        name={'Dashed'}
        initialValue={areAllDashed(getSelected(props.app))}
        set={b => {
          let tbs = getSelected(props.app);
          if (tbs.length > 0) {
            let shouldDash = b && !areAllDashed(tbs);
            let shouldUndash = !b && !areAllNotDashed(tbs);
            if (shouldDash || shouldUndash) {
              props.app.pushUndo();
              tbs.forEach(tb => {
                tb.strokeDasharray = b ? TertiaryBond.dashedStrokeDasharray : '';
              });
              props.app.drawingChangedNotByInteraction();
            }
          }
        }}
      />
    );
  }
}
