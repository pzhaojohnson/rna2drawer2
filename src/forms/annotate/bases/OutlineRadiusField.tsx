import * as React from 'react';
import { BaseInterface as Base } from '../../../draw/BaseInterface';
import NonnegativeNumberField from '../../fields/text/NonnegativeNumberField';

function _sharedOutlineRadius(bs: Base[]): number | undefined {
  let radii = new Set<number>();
  let lastAdded = undefined;
  bs.forEach(b => {
    if (b.outline) {
      radii.add(b.outline.radius);
      lastAdded = b.outline.radius;
    }
  });
  return radii.size == 1 ? lastAdded : undefined;
}

export function OutlineRadiusField(selectedBases: () => Base[], pushUndo: () => void, changed: () => void): React.ReactElement {
  return (
    <NonnegativeNumberField
      name={'Radius'}
      initialValue={_sharedOutlineRadius(selectedBases())}
      set={r => {
        let bs = selectedBases();
        if (bs.length == 0) {
          return;
        }
        if (r != _sharedOutlineRadius(bs)) {
          pushUndo();
          bs.forEach(b => {
            if (b.outline) {
              b.outline.radius = r;
            }
          });
          changed();
        }
      }}
    />
  );
}

export default OutlineRadiusField;
