import { BaseNumberingInterface as BaseNumbering } from '../../../draw/BaseNumberingInterface';
import * as React from 'react';
import { NonnegativeNumberField } from '../../fields/text/NonnegativeNumberField';
import { FieldProps } from './FieldProps';
import { getAtIndex } from '../../../array/getAtIndex';
import { round } from '../../../math/round';

const PRECISION = 2;

function getFirstLineLength(bns: BaseNumbering[]): number | undefined {
  let first = getAtIndex(bns, 0);
  if (first) {
    return round(first.lineLength, PRECISION);
  }
}

export function LineLengthField(props: FieldProps): React.ReactElement | null {
  let bns = props.getBaseNumberings();
  if (bns.length == 0) {
    return null;
  } else {
    return (
      <NonnegativeNumberField
        name='Line Length'
        initialValue={getFirstLineLength(bns)}
        set={ll => {
          let bns = props.getBaseNumberings();
          if (bns.length > 0) {
            if (ll != getFirstLineLength(bns)) {
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
