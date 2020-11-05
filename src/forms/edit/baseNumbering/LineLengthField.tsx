import * as React from 'react';
import { BaseNumberingInterface as BaseNumbering } from '../../../draw/BaseNumberingInterface';
import { FieldProps } from './FieldProps';
import { NonnegativeNumberField } from '../../fields/text/NonnegativeNumberField';

function getLineLengths(bns: BaseNumbering[]): Set<number> {
  let lls = new Set<number>();
  bns.forEach(bn => {
    let ll = Number.parseFloat(bn.lineLength.toFixed(2));
    if (Number.isFinite(ll)) {
      lls.add(ll);
    }
  });
  return lls;
}

function getInitialValue(bns: BaseNumbering[]): number | undefined {
  let lls = getLineLengths(bns);
  if (lls.size == 1) {
    return lls.values().next().value;
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
        initialValue={getInitialValue(bns)}
        set={ll => {
          let bns = props.getBaseNumberings();
          if (bns.length > 0) {
            if (ll != getInitialValue(bns)) {
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
