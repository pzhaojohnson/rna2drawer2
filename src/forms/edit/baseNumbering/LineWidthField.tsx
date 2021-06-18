import * as React from 'react';
import { NonnegativeNumberField } from '../../fields/text/NonnegativeNumberField';
import { FieldProps } from './FieldProps';
import { atIndex } from 'Array/at';
import { BaseNumbering } from 'Draw/bases/numbering/BaseNumbering';

export function LineWidthField(props: FieldProps): React.ReactElement | null {
  let bns = props.getBaseNumberings();
  if (bns.length == 0) {
    return null;
  } else {
    let first = atIndex(bns, 0);
    let strokeWidth = first?.line.attr('stroke-width');
    return (
      <NonnegativeNumberField
        name='Line Width'
        initialValue={typeof strokeWidth == 'number' ? strokeWidth : undefined}
        set={lw => {
          let bns = props.getBaseNumberings();
          if (bns.length > 0) {
            let first = atIndex(bns, 0);
            let strokeWidth = first?.line.attr('stroke-width');
            if (lw != strokeWidth) {
              props.pushUndo();
              bns.forEach(bn => bn.line.attr({ 'stroke-width': lw }));
              BaseNumbering.recommendedDefaults.line['stroke-width'] = lw;
              props.changed();
            }
          }
        }}
      />
    );
  }
}
