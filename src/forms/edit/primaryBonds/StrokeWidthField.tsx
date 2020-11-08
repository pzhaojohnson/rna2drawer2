import * as React from 'react';
import { NonnegativeNumberField } from '../../fields/text/NonnegativeNumberField';
import { FieldProps } from './FieldProps';
import { getAtIndex } from '../../../array/getAtIndex';

export function StrokeWidthField(props: FieldProps): React.ReactElement {
  let pbs = props.getPrimaryBonds();
  let first = getAtIndex(pbs, 0);
  return (
    <NonnegativeNumberField
      name='Line Width'
      initialValue={first ? first.strokeWidth : undefined}
      set={sw => {
        let pbs = props.getPrimaryBonds();
        if (pbs.length > 0) {
          let first = getAtIndex(pbs, 0);
          if (!first || sw != first.strokeWidth) {
            props.pushUndo();
            pbs.forEach(pb => {
              pb.strokeWidth = sw;
            });
            props.changed();
          }
        }
      }}
    />
  );
}
