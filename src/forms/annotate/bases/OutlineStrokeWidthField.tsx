import * as React from 'react';
import { BaseInterface as Base } from '../../../draw/BaseInterface';
import NonnegativeNumberField from '../../fields/text/NonnegativeNumberField';

function _sharedOutlineStrokeWidth(bs: Base[]): number | undefined {
  let strokeWidths = new Set<number>();
  let lastAdded = undefined;
  bs.forEach(b => {
    if (b.outline) {
      strokeWidths.add(b.outline.strokeWidth);
      lastAdded = b.outline.strokeWidth;
    }
  });
  return strokeWidths.size == 1 ? lastAdded : undefined;
}

export function OutlineStrokeWidthField(selectedBases: () => Base[], pushUndo: () => void, changed: () => void): React.ReactElement {
  return (
    <NonnegativeNumberField
      name={'Line Width'}
      initialValue={_sharedOutlineStrokeWidth(selectedBases())}
      set={sw => {
        let bs = selectedBases();
        if (bs.length == 0) {
          return;
        }
        if (sw != _sharedOutlineStrokeWidth(bs)) {
          pushUndo();
          bs.forEach(b => {
            if (b.outline) {
              b.outline.strokeWidth = sw;
            }
          });
          changed();
        }
      }}
    />
  );
}

export default OutlineStrokeWidthField;
