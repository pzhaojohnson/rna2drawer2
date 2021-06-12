import { BaseNumberingInterface } from 'Draw/bases/numbering/BaseNumberingInterface';
import { BaseNumbering } from 'Draw/bases/numbering/BaseNumbering';
import * as React from 'react';
import { NonnegativeNumberField } from '../../fields/text/NonnegativeNumberField';
import { FieldProps } from './FieldProps';
import { atIndex } from 'Array/at';
import { round } from '../../../math/round';

const PRECISION = 2;

function getFirstBasePadding(bns: BaseNumberingInterface[]): number | undefined {
  let first = atIndex(bns, 0);
  if (first) {
    return round(first.basePadding, PRECISION);
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
        initialValue={getFirstBasePadding(bns)}
        set={bp => {
          let bns = props.getBaseNumberings();
          if (bns.length > 0) {
            if (bp != getFirstBasePadding(bns)) {
              props.pushUndo();
              bns.forEach(bn => bn.basePadding = bp);
              BaseNumbering.defaults.basePadding = bp;
              props.changed();
            }
          }
        }}
      />
    );
  }
}
