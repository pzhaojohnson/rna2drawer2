import { PrimaryBondInterface as PrimaryBond } from '../../../draw/StraightBondInterface';
import * as React from 'react';
import { NonnegativeNumberField } from '../../fields/text/NonnegativeNumberField';
import { FieldProps } from './FieldProps';
import { atIndex } from 'Array/at';
import { round } from '../../../math/round';

const PRECISION = 2;

function getFirstPadding(pbs: PrimaryBond[]): number | undefined {
  let first = atIndex(pbs, 0);
  if (first) {
    return round(first.padding1, PRECISION);
  }
}

export function PaddingField(props: FieldProps): React.ReactElement | null {
  let pbs = props.getPrimaryBonds();
  if (pbs.length == 0) {
    return null;
  } else {
    return (
      <NonnegativeNumberField
        name='Padding'
        initialValue={getFirstPadding(pbs)}
        set={p => {
          let pbs = props.getPrimaryBonds();
          if (pbs.length > 0) {
            if (p != getFirstPadding(pbs)) {
              props.pushUndo();
              pbs.forEach(pb => {
                pb.padding1 = p;
                pb.padding2 = p;
              });
              props.changed();
            }
          }
        }}
      />
    );
  }
}
