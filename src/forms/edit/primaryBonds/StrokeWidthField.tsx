import * as React from 'react';
import { NonnegativeNumberField } from '../../fields/text/NonnegativeNumberField';
import { FieldProps } from './FieldProps';
import { atIndex } from 'Array/at';

export function StrokeWidthField(props: FieldProps): React.ReactElement | null {
  let pbs = props.getPrimaryBonds();
  if (pbs.length == 0) {
    return null;
  } else {
    let first = atIndex(pbs, 0);
    return (
      <NonnegativeNumberField
        name='Line Width'
        initialValue={first?.strokeWidth}
        set={sw => {
          let pbs = props.getPrimaryBonds();
          if (pbs.length > 0) {
            let first = atIndex(pbs, 0);
            if (sw != first?.strokeWidth) {
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
}
