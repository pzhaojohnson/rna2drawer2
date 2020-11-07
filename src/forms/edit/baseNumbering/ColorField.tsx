import * as React from 'react';
import { BaseNumberingInterface as BaseNumbering } from '../../../draw/BaseNumberingInterface';
import { FieldProps } from './FieldProps';
import * as Svg from '@svgdotjs/svg.js';
import { parseColor } from '../../../parse/parseColor';
import { areAllSameColor } from '../../fields/color/areAllSameColor';
import { getAtIndex } from '../../../array/getAtIndex';
import { ColorField as Field, ColorAndOpacity } from '../../fields/color/ColorField';

function getColors(bns: BaseNumbering[]): Svg.Color[] {
  let cs = [] as Svg.Color[];
  bns.forEach(bn => {
    let c = parseColor(bn.color);
    if (c) {
      cs.push(c);
    }
  });
  return cs;
}

function getInitialValue(bns: BaseNumbering[]): ColorAndOpacity | undefined {
  if (bns.length > 0) {
    let cs = getColors(bns);
    if (areAllSameColor(cs)) {
      let c = getAtIndex(cs, 0);
      if (c) {
        return { color: c.toHex(), opacity: 1 };
      }
    }
  }
}

export function ColorField(props: FieldProps): React.ReactElement | null {
  let bns = props.getBaseNumberings();
  if (bns.length == 0) {
    return null;
  } else {
    return (
      <Field
        name='Color'
        initialValue={getInitialValue(bns)}
        set={co => {
          let c = parseColor(co.color);
          if (c) {
            let bns = props.getBaseNumberings();
            if (bns.length > 0) {
              if (c.toHex() != getInitialValue(bns)?.color) {
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
