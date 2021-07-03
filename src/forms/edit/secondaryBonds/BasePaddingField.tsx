import { SecondaryBondInterface } from 'Draw/bonds/straight/SecondaryBondInterface';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import * as React from 'react';
import { NonnegativeNumberField } from '../../fields/text/NonnegativeNumberField';
import { FieldProps } from './FieldProps';
import { atIndex } from 'Array/at';
import { round } from '../../../math/round';

const PRECISION = 2;

function getFirstPadding(sbs: SecondaryBondInterface[]): number | undefined {
  let first = atIndex(sbs, 0);
  if (first) {
    return round(first.basePadding1, PRECISION);
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
                sb.basePadding1 = p;
                sb.basePadding2 = p;
              });
              props.changed();
              Object.values(SecondaryBond.recommendedDefaults).forEach(vs => {
                vs.basePadding1 = p;
                vs.basePadding2 = p;
              });
            }
          }
        }}
      />
    );
  }
}
