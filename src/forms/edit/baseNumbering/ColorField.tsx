import { BaseNumberingInterface } from 'Draw/bases/numbering/BaseNumberingInterface';
import { BaseNumbering } from 'Draw/bases/numbering/BaseNumbering';
import * as React from 'react';
import { ColorField as Field } from '../../fields/color/ColorField';
import { FieldProps } from './FieldProps';
import * as Svg from '@svgdotjs/svg.js';
import { parseColor } from '../../../parse/parseColor';
import { atIndex } from 'Array/at';

function getFirstColor(bns: BaseNumberingInterface[]): Svg.Color | undefined {
  let first = atIndex(bns, 0);
  if (first) {
    return parseColor(first.text.attr('fill'));
  }
}

export function ColorField(props: FieldProps): React.ReactElement | null {
  let bns = props.getBaseNumberings();
  if (bns.length == 0) {
    return null;
  } else {
    let firstColor = getFirstColor(bns);
    return (
      <Field
        name='Color'
        initialValue={firstColor ? { color: firstColor.toHex(), opacity: 1 } : undefined}
        set={co => {
          let parsed = parseColor(co.color);
          if (parsed) {
            let c = parsed;
            let bns = props.getBaseNumberings();
            if (bns.length > 0) {
              if (c.toHex() != getFirstColor(bns)?.toHex()) {
                props.pushUndo();
                bns.forEach(bn => {
                  bn.text.attr({ 'fill': c.toHex() });
                  bn.line.attr({ 'stroke': c.toHex() });
                });
                BaseNumbering.recommendedDefaults.text['fill'] = c.toHex();
                BaseNumbering.recommendedDefaults.line['stroke'] = c.toHex();
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
