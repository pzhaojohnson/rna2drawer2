import * as React from 'react';
import { BaseInterface as Base } from '../../../draw/BaseInterface';
import { CircleBaseAnnotationInterface as CircleBaseAnnotation } from '../../../draw/BaseAnnotationInterface';
import { ColorField, ColorAndOpacity } from '../../fields/color/ColorField';
import * as Svg from '@svgdotjs/svg.js';
import baseOutlines from './baseOutlines';
import { areAllSameColor, areAllSameNumber } from './areAllSame';
import MostRecentOutlineProps from './MostRecentOutlineProps';

function outlineStrokes(os: CircleBaseAnnotation[]): Svg.Color[] {
  let ss = [] as Svg.Color[];
  os.forEach(o => ss.push(new Svg.Color(o.stroke)));
  return ss;
}

function outlineStrokeOpacities(os: CircleBaseAnnotation[]): number[] {
  let sos = [] as number[];
  os.forEach(o => sos.push(o.strokeOpacity));
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
    initialValue = { color: o1.stroke, opacity: o1.strokeOpacity };
  }
  return (
    <ColorField
      name={'Line Color'}
      initialValue={initialValue}
      set={co => {
        let os = baseOutlines(selectedBases());
        let o1 = os[0];
        if (o1) {
          if (!outlinesAllHaveSameStrokeColor(os) || co.color != o1.stroke || co.opacity != o1.strokeOpacity) {
            pushUndo();
            os.forEach(o => {
              o.stroke = co.color;
              o.strokeOpacity = co.opacity;
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
