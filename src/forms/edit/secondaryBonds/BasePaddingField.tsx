import { SecondaryBondInterface as SecondaryBond } from '../../../draw/StraightBondInterface';
import * as React from 'react';
import { NonnegativeNumberField } from '../../fields/text/NonnegativeNumberField';
import { FieldProps } from './FieldProps';
import { atIndex } from 'Array/at';
import { round } from '../../../math/round';

const PRECISION = 2;

function getFirstPadding(sbs: SecondaryBond[]): number | undefined {
  let first = atIndex(sbs, 0);
  if (first) {
    return round(first.padding1, PRECISION);
  }
}

export function BasePaddingField(props: FieldProps): React.ReactElement | null {
  let sbs = props.getAllSecondaryBonds();
  if (sbs.length == 0) {
    return null;
  } else {
    return (
      <NonnegativeNumberField
        name='Base Padding'
        initialValue={getFirstPadding(sbs)}
        set={p => {
          let sbs = props.getAllSecondaryBonds();
          if (sbs.length > 0) {
            if (p != getFirstPadding(sbs)) {
              props.pushUndo();
              sbs.forEach(sb => {
                sb.padding1 = p;
                sb.padding2 = p;
              });
              props.changed();
            }
          }
        }}
      />
    );
  }
}
