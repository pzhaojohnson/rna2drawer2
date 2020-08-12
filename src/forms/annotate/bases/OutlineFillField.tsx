import * as React from 'react';
import { BaseInterface as Base } from '../../../draw/BaseInterface';
import { CircleBaseAnnotationInterface as CircleBaseAnnotation } from '../../../draw/BaseAnnotationInterface';
import { ColorField, ColorAndOpacity } from '../../fields/color/ColorField';
import * as Svg from '@svgdotjs/svg.js';
import baseOutlines from './baseOutlines';
import { areAllSameNumber, areAllSameColor } from './areAllSame';
import MostRecentOutlineProps from './MostRecentOutlineProps';

function outlineFills(os: CircleBaseAnnotation[]): Svg.Color[] {
  let fs = [] as Svg.Color[];
  os.forEach(o => fs.push(new Svg.Color(o.fill)));
  return fs;
}

function outlineFillOpacities(os: CircleBaseAnnotation[]): number[] {
  let fos = [] as number[];
  os.forEach(o => fos.push(o.fillOpacity));
  return fos;
}

function outlinesAllHaveSameFillColor(os: CircleBaseAnnotation[]): boolean {
  return areAllSameColor(outlineFills(os)) && areAllSameNumber(outlineFillOpacities(os));
}

export function OutlineFillField(selectedBases: () => Base[], pushUndo: () => void, changed: () => void): React.ReactElement {
  let os = baseOutlines(selectedBases());
  let o1 = os[0];
  let initialValue = undefined;
  if (o1 && outlinesAllHaveSameFillColor(os)) {
    initialValue = { color: o1.fill, opacity: o1.fillOpacity };
  }
  return (
    <ColorField
      name={'Fill'}
      initialValue={initialValue}
      set={co => {
        let os = baseOutlines(selectedBases());
        let o1 = os[0];
        if (o1) {
          if (!outlinesAllHaveSameFillColor(os) || co.color != o1.fill || co.opacity != o1.fillOpacity) {
            pushUndo();
            os.forEach(o => {
              o.fill = co.color;
              o.fillOpacity = co.opacity;
            });
            MostRecentOutlineProps.fill = co.color;
            MostRecentOutlineProps.fillOpacity = co.opacity;
            changed();
          }
        }
      }}
    />
  );
}

export default OutlineFillField;
