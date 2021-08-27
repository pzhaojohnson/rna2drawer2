import * as React from 'react';
import { FieldProps as Props } from './FieldProps';
import { CircleBaseAnnotationInterface as CircleBaseAnnotation } from 'Draw/bases/annotate/circle/CircleBaseAnnotationInterface';
import { ColorField, ColorAndOpacity } from '../../fields/color/ColorField';
import * as Svg from '@svgdotjs/svg.js';
import baseOutlines from './baseOutlines';
import { areAllSameColor } from '../../fields/color/areAllSameColor';
import { areAllSameNumber } from '../../fields/text/areAllSameNumber';
import MostRecentOutlineProps from './MostRecentOutlineProps';
import { parseColor } from 'Parse/svg/color';

function outlineFills(os: CircleBaseAnnotation[]): Svg.Color[] {
  let fs = [] as Svg.Color[];
  os.forEach(o => {
    let f = parseColor(o.circle.attr('fill'));
    if (f) {
      fs.push(f);
    }
  });
  return fs;
}

function outlineFillOpacities(os: CircleBaseAnnotation[]): number[] {
  let fos = [] as number[];
  os.forEach(o => {
    let fo = o.circle.attr('fill-opacity');
    if (typeof fo == 'number') {
      fos.push(fo);
    }
  });
  return fos;
}

function outlinesAllHaveSameFillColor(os: CircleBaseAnnotation[]): boolean {
  return areAllSameColor(outlineFills(os)) && areAllSameNumber(outlineFillOpacities(os));
}

export function OutlineFillField(props: Props): React.ReactElement {
  let os = baseOutlines(props.selectedBases());
  let o1 = os[0];
  let initialValue = undefined;
  if (o1 && outlinesAllHaveSameFillColor(os)) {
    initialValue = { color: String(o1.circle.attr('fill')), opacity: Number(o1.circle.attr('fill-opacity')) };
  }
  return (
    <ColorField
      name={'Fill'}
      initialValue={initialValue}
      set={co => {
        let os = baseOutlines(props.selectedBases());
        let o1 = os[0];
        if (o1) {
          if (!outlinesAllHaveSameFillColor(os) || co.color != o1.circle.attr('fill') || co.opacity != o1.circle.attr('fill-opacity')) {
            props.pushUndo();
            os.forEach(o => {
              o.circle.attr({
                'fill': co.color,
                'fill-opacity': co.opacity,
              });
            });
            MostRecentOutlineProps.fill = co.color;
            MostRecentOutlineProps.fillOpacity = co.opacity;
            props.changed();
          }
        }
      }}
    />
  );
}

export default OutlineFillField;
