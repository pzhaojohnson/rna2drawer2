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
    let firstStrokeWidth = first?.line.attr('stroke-width');
    return (
      <NonnegativeNumberField
        name='Line Width'
        initialValue={typeof firstStrokeWidth == 'number' ? firstStrokeWidth : undefined}
        set={sw => {
          let sbs = props.getAllSecondaryBonds();
          if (sbs.length > 0) {
            let first = atIndex(sbs, 0);
            if (sw != first?.line.attr('stroke-width')) {
              props.pushUndo();
              sbs.forEach(sb => {
                sb.line.attr({ 'stroke-width': sw });
              });
              props.changed();
            }
          }
        }}
      />
    );
  }
}
