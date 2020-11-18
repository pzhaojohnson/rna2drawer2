import { PrimaryBondInterface as PrimaryBond } from '../../../draw/StraightBondInterface';
import * as React from 'react';
import { ColorField } from '../../fields/color/ColorField';
import { FieldProps } from './FieldProps';
import { getAtIndex } from '../../../array/getAtIndex';
import * as Svg from '@svgdotjs/svg.js';
import { parseColor } from '../../../parse/parseColor';

function getFirstStroke(pbs: PrimaryBond[]): Svg.Color | undefined {
  let first = getAtIndex(pbs, 0);
  if (first) {
    return parseColor(first.stroke);
  }
}

export function StrokeField(props: FieldProps): React.ReactElement | null {
  let pbs = props.getPrimaryBonds();
  if (pbs.length == 0) {
    return null;
  } else {
    let firstStroke = getFirstStroke(pbs);
    return (
      <ColorField
        name='Color'
        initialValue={firstStroke ? { color: firstStroke.toHex(), opacity: 1 } : undefined}
        set={co => {
          let parsed = parseColor(co.color);
          if (parsed) {
            let s = parsed;
            let pbs = props.getPrimaryBonds();
            if (pbs.length > 0) {
              if (s.toHex() != getFirstStroke(pbs)?.toHex()) {
                props.pushUndo();
                pbs.forEach(pb => {
                  pb.stroke = s.toHex();
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
