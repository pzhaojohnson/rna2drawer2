import * as React from 'react';
import { BaseNumberingInterface as BaseNumbering } from '../../../draw/BaseNumberingInterface';
import { FieldProps } from './FieldProps';
import { NonnegativeNumberField } from '../../fields/text/NonnegativeNumberField';

function getLineWidths(bns: BaseNumbering[]): Set<number> {
  let lws = new Set<number>();
  bns.forEach(bn => lws.add(bn.lineStrokeWidth));
  return lws;
}

function getInitialValue(bns: BaseNumbering[]): number | undefined {
  let lws = getLineWidths(bns);
  if (lws.size == 1) {
    return lws.values().next().value;
  }
}

export function LineWidthField(props: FieldProps): React.ReactElement | null {
  let bns = props.getBaseNumberings();
  if (bns.length == 0) {
    return null;
  } else {
    return (
      <NonnegativeNumberField
        name='Line Width'
        initialValue={getInitialValue(bns)}
        set={lw => {
          let bns = props.getBaseNumberings();
          if (bns.length > 0) {
            if (lw != getInitialValue(bns)) {
              props.pushUndo();
              bns.forEach(bn => bn.lineStrokeWidth = lw);
              props.changed();
            }
          }
        }}
      />
    );
  }
}
