import { BaseNumberingInterface } from 'Draw/bases/numbering/BaseNumberingInterface';
import { BaseNumbering } from 'Draw/bases/numbering/BaseNumbering';
import * as React from 'react';
import { NonnegativeNumberField } from '../../fields/text/NonnegativeNumberField';
import { FieldProps } from './FieldProps';
import { atIndex } from 'Array/at';
import { round } from '../../../math/round';

const PRECISION = 2;

function getFirstLineLength(bns: BaseNumberingInterface[]): number | undefined {
  let first = atIndex(bns, 0);
  let lineLength = first?.lineLength;
  if (typeof lineLength == 'number') {
    return round(lineLength, PRECISION);
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
              BaseNumbering.defaults.lineLength = ll;
              props.changed();
            }
          }
        }}
      />
    );
  }
}
