import * as React from 'react';
import { NonnegativeNumberField } from '../../fields/text/NonnegativeNumberField';
import { FieldProps } from './FieldProps';
import { getAtIndex } from '../../../array/getAtIndex';

export function PaddingField(props: FieldProps): React.ReactElement {
  let sbs = props.getAllSecondaryBonds();
  let first = getAtIndex(sbs, 0);
  return (
    <NonnegativeNumberField
      name='Padding'
      initialValue={first ? first.padding1 : undefined}
      set={p => {
        let sbs = props.getAllSecondaryBonds();
        if (sbs.length > 0) {
          let first = getAtIndex(sbs, 0);
          if (!first || p != first.padding1) {
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
