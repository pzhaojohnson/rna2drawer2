import { PrimaryBondInterface } from 'Draw/bonds/straight/PrimaryBondInterface';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import * as React from 'react';
import { ColorField } from '../../fields/color/ColorField';
import { FieldProps } from './FieldProps';
import { atIndex } from 'Array/at';
import * as Svg from '@svgdotjs/svg.js';
import { parseColor } from '../../../parse/parseColor';

function getFirstStroke(pbs: PrimaryBondInterface[]): Svg.Color | undefined {
  let first = atIndex(pbs, 0);
  if (first) {
    return parseColor(first.line.attr('stroke'));
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
                  pb.line.attr({ 'stroke': s.toHex() });
                });
                props.changed();
                PrimaryBond.recommendedDefaults.line['stroke'] = s.toHex();
              }
            }
          }
        }}
        disableAlpha={true}
      />
    );
  }
}
