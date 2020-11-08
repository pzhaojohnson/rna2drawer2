import * as React from 'react';
import { ColorField } from '../../fields/color/ColorField';
import { FieldProps } from './FieldProps';
import { parseColor } from '../../../parse/parseColor';
import { getAtIndex } from '../../../array/getAtIndex';

export function StrokeField(props: FieldProps): React.ReactElement | null {
  let pbs = props.getPrimaryBonds();
  if (pbs.length == 0) {
    return null;
  } else {
    let first = getAtIndex(pbs, 0);
    let firstStroke = first ? parseColor(first.stroke) : undefined;
    return (
      <ColorField
        name='Color'
        initialValue={firstStroke ? { color: firstStroke.toHex(), opacity: 1 } : undefined}
        set={co => {
          let s = parseColor(co.color);
          if (s) {
            let pbs = props.getPrimaryBonds();
            if (pbs.length > 0) {
              let first = getAtIndex(pbs, 0);
              let firstStroke = first ? parseColor(first.stroke) : undefined;
              if (!firstStroke || s.toHex() != firstStroke.toHex()) {
                props.pushUndo();
                pbs.forEach(pb => {
                  if (s) {
                    pb.stroke = s.toHex();
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
