import * as React from 'react';
import { NonnegativeNumberField } from '../../fields/text/NonnegativeNumberField';
import { FieldProps } from './FieldProps';
import { getAtIndex } from '../../../array/getAtIndex';

function trim(n: number): number {
  let trimmed = Number.parseFloat(n.toFixed(2));
  return Number.isFinite(trimmed) ? trimmed : n;
}

export function LineLengthField(props: FieldProps): React.ReactElement | null {
  let bns = props.getBaseNumberings();
  if (bns.length == 0) {
    return null;
  } else {
    let first = getAtIndex(bns, 0);
    return (
      <NonnegativeNumberField
        name='Line Length'
        initialValue={first ? trim(first.lineLength) : undefined}
        set={ll => {
          let bns = props.getBaseNumberings();
          if (bns.length > 0) {
            let first = getAtIndex(bns, 0);
            if (!first || ll != trim(first.lineLength)) {
              props.pushUndo();
              bns.forEach(bn => bn.lineLength = ll);
              props.changed();
            }
          }
        }}
      />
    );
  }
}
