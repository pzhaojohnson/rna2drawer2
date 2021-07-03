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
    let firstStrokeWidth = first?.line.attr('stroke-width');
    return (
      <NonnegativeNumberField
        name='Line Width'
        initialValue={typeof firstStrokeWidth == 'number' ? firstStrokeWidth : undefined}
        set={sw => {
          let pbs = props.getPrimaryBonds();
          if (pbs.length > 0) {
            let first = atIndex(pbs, 0);
            if (sw != first?.line.attr('stroke-width')) {
              props.pushUndo();
              pbs.forEach(pb => {
                pb.line.attr({ 'stroke-width': sw });
              });
              props.changed();
            }
          }
        }}
      />
    );
  }
}
