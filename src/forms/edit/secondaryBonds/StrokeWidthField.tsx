import * as React from 'react';
import { NonnegativeNumberField } from '../../fields/text/NonnegativeNumberField';
import { FieldProps } from './FieldProps';
import { atIndex } from 'Array/at';

export function StrokeWidthField(props: FieldProps): React.ReactElement | null {
  let sbs = props.getAllSecondaryBonds();
  if (sbs.length == 0) {
    return null;
  } else {
    let first = atIndex(sbs, 0);
    return (
      <NonnegativeNumberField
        name='Line Width'
        initialValue={first?.strokeWidth}
        set={sw => {
          let sbs = props.getAllSecondaryBonds();
          if (sbs.length > 0) {
            let first = atIndex(sbs, 0);
            if (sw != first?.strokeWidth) {
              props.pushUndo();
              sbs.forEach(sb => {
                sb.strokeWidth = sw;
              });
              props.changed();
            }
          }
        }}
      />
    );
  }
}
