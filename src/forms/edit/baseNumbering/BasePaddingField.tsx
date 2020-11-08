import * as React from 'react';
import { NonnegativeNumberField } from '../../fields/text/NonnegativeNumberField';
import { FieldProps } from './FieldProps';
import { getAtIndex } from '../../../array/getAtIndex';

function trim(n: number): number {
  let trimmed = Number.parseFloat(n.toFixed(2));
  return Number.isFinite(trimmed) ? trimmed : n;
}

export function BasePaddingField(props: FieldProps): React.ReactElement | null {
  let bns = props.getBaseNumberings();
  if (bns.length == 0) {
    return null;
  } else {
    let first = getAtIndex(bns, 0);
    return (
      <NonnegativeNumberField
        name='Base Padding'
        initialValue={first ? trim(first.basePadding) : undefined}
        set={bp => {
          let bns = props.getBaseNumberings();
          if (bns.length > 0) {
            let first = getAtIndex(bns, 0);
            if (!first || bp != trim(first.basePadding)) {
              props.pushUndo();
              bns.forEach(bn => bn.basePadding = bp);
              props.changed();
            }
          }
        }}
      />
    );
  }
}
