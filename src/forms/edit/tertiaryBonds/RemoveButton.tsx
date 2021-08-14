import * as React from 'react';
import { SolidButton } from 'Forms/buttons/SolidButton';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { TertiaryBondInterface as TertiaryBond } from 'Draw/bonds/curved/TertiaryBondInterface';
import { removeTertiaryBondById } from 'Draw/bonds/curved/remove';

export type Props = {
  drawing: Drawing;
  getTertiaryBonds: () => TertiaryBond[];
  pushUndo: () => void;
  changed: () => void;
}

export function RemoveButton(props: Props) {
  return props.getTertiaryBonds().length == 0 ? null : (
    <SolidButton
      text='Remove'
      onClick={() => {
        let tbs = props.getTertiaryBonds();
        if (tbs.length > 0) {
          props.pushUndo();
          let ids = tbs.map(tb => tb.id);
          ids.forEach(id => removeTertiaryBondById(props.drawing, id));
          props.changed();
        }
      }}
    />
  );
}
