import * as React from 'react';
import { BaseInterface as Base } from '../../../draw/BaseInterface';
import { CircleBaseAnnotationInterface as CircleBaseAnnotation } from '../../../draw/BaseAnnotationInterface';
import { ColorField, ColorAndOpacity } from '../../fields/color/ColorField';
import * as Svg from '@svgdotjs/svg.js';
import baseOutlines from './baseOutlines';
import { areAllSameColor } from '../../fields/color/areAllSameColor';
import { areAllSameNumber } from '../../fields/text/areAllSameNumber';
import MostRecentOutlineProps from './MostRecentOutlineProps';
import { parseColor } from 'Parse/parseColor';

function outlineStrokes(os: CircleBaseAnnotation[]): Svg.Color[] {
  let ss = [] as Svg.Color[];
  os.forEach(o => {
    let s = parseColor(o.circle.attr('stroke'));
    if (s) {
      ss.push(s);
    }
  });
  return ss;
}

function outlineStrokeOpacities(os: CircleBaseAnnotation[]): number[] {
  let sos = [] as number[];
  os.forEach(o => {
    let so = o.circle.attr('stroke-opacity');
    if (typeof so == 'number') {
      sos.push(so);
    }
  });
  return sos;
}

function outlinesAllHaveSameStrokeColor(os: CircleBaseAnnotation[]): boolean {
  return areAllSameColor(outlineStrokes(os)) && areAllSameNumber(outlineStrokeOpacities(os));
}

export function OutlineStrokeField(selectedBases: () => Base[], pushUndo: () => void, changed: () => void): React.ReactElement {
  let os = baseOutlines(selectedBases());
  let o1 = os[0];
  let initialValue = undefined;
  if (o1 && outlinesAllHaveSameStrokeColor(os)) {
    initialValue = { color: o1.circle.attr('stroke'), opacity: o1.circle.attr('stroke-opacity') };
  }
  return (
    <ColorField
      name={'Line Color'}
      initialValue={initialValue}
      set={co => {
        let os = baseOutlines(selectedBases());
        let o1 = os[0];
        if (o1) {
          if (!outlinesAllHaveSameStrokeColor(os) || co.color != o1.circle.attr('stroke') || co.opacity != o1.circle.attr('stroke-opacity')) {
            pushUndo();
            os.forEach(o => {
              o.circle.attr({
                'stroke': co.color,
                'stroke-opacity': co.opacity,
              });
            });
            MostRecentOutlineProps.stroke = co.color;
            MostRecentOutlineProps.strokeOpacity = co.opacity;
            changed();
          }
        }
      }}
    />
  );
}

export default OutlineStrokeField;
