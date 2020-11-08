import * as React from 'react';
import { ColorField as Field } from '../../fields/color/ColorField';
import { FieldProps } from './FieldProps';
import { parseColor } from '../../../parse/parseColor';
import { getAtIndex } from '../../../array/getAtIndex';

export function ColorField(props: FieldProps): React.ReactElement | null {
  let bns = props.getBaseNumberings();
  if (bns.length == 0) {
    return null;
  } else {
    let first = getAtIndex(bns, 0);
    let firstColor = first ? parseColor(first.color) : undefined;
    return (
      <Field
        name='Color'
        initialValue={firstColor ? { color: firstColor.toHex(), opacity: 1 } : undefined}
        set={co => {
          let c = parseColor(co.color);
          if (c) {
            let bns = props.getBaseNumberings();
            if (bns.length > 0) {
              let first = getAtIndex(bns, 0);
              let firstColor = first ? parseColor(first.color) : undefined;
              if (!firstColor || c.toHex() != firstColor.toHex()) {
                props.pushUndo();
                bns.forEach(bn => {
                  if (c) {
                    bn.color = c.toHex();
                  }
                });
                props.changed();
              }
            }
          }
        }}
        disableAlpha={true}
      />
    );
  }
}
