import * as React from 'react';
import { getAtIndex } from '../../../array/getAtIndex';
import { NonnegativeNumberField } from '../../fields/text/NonnegativeNumberField';
import { FieldProps } from './FieldProps';

export function PaddingField(props: FieldProps): React.ReactElement | null {
  let pbs = props.getPrimaryBonds();
  if (pbs.length == 0) {
    return null;
  } else {
    let first = getAtIndex(pbs, 0);
    return (
      <NonnegativeNumberField
        name='Padding'
        initialValue={first ? first.padding1 : undefined}
        set={p => {
          let pbs = props.getPrimaryBonds();
          if (pbs.length > 0) {
            let first = getAtIndex(pbs, 0);
            if (!first || p != first.padding1) {
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
