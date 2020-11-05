import * as React from 'react';
import { BaseNumberingInterface as BaseNumbering } from '../../../draw/BaseNumberingInterface';
import { FieldProps } from './FieldProps';
import { NonnegativeNumberField } from '../../fields/text/NonnegativeNumberField';

function getBasePaddings(bns: BaseNumbering[]): Set<number> {
  let bps = new Set<number>();
  bns.forEach(bn => bps.add(bn.basePadding));
  return bps;
}

function getInitialValue(bns: BaseNumbering[]): number | undefined {
  let bps = getBasePaddings(bns);
  if (bps.size == 1) {
    return bps.values().next().value;
  }
}

export function BasePaddingField(props: FieldProps): React.ReactElement | null {
  let bns = props.getBaseNumberings();
  if (bns.length == 0) {
    return null;
  } else {
    return (
      <NonnegativeNumberField
        name='Base Padding'
        initialValue={getInitialValue(bns)}
        set={bp => {
          let bns = props.getBaseNumberings();
          if (bns.length > 0) {
            if (bp != getInitialValue(bns)) {
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
