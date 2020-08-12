import * as React from 'react';
import { BaseInterface as Base } from '../../../draw/BaseInterface';
import { ColorField, ColorAndOpacity } from '../../fields/color/ColorField';
import * as Svg from '@svgdotjs/svg.js';
import { areAllSameColor, areAllSameNumber } from './areAllSame';

function baseFills(bs: Base[]): Svg.Color[] {
  let fs = [] as Svg.Color[];
  bs.forEach(b => fs.push(new Svg.Color(b.fill)));
  return fs;
}

function baseFillOpacities(bs: Base[]): number[] {
  let fos = [] as number[];
  bs.forEach(b => fos.push(b.fillOpacity));
  return fos;
}

function basesAllHaveSameColor(bs: Base[]): boolean {
  return areAllSameColor(baseFills(bs)) && areAllSameNumber(baseFillOpacities(bs));
}

export function BaseColorField(selectedBases: () => Base[], pushUndo: () => void, changed: () => void): React.ReactElement {
  let bs = selectedBases();
  let b1 = bs[0];
  let initialValue = undefined;
  if (b1 && basesAllHaveSameColor(bs)) {
    initialValue = { color: b1.fill, opacity: b1.fillOpacity };
  }
  return (
    <ColorField
      name={'Base Color'}
      initialValue={initialValue}
      set={co => {
        let bs = selectedBases();
        let b1 = bs[0];
        if (b1) {
          if (!basesAllHaveSameColor(bs) || co.color != b1.fill || co.opacity != b1.fillOpacity) {
            pushUndo();
            bs.forEach(b => {
              b.fill = co.color;
              b.fillOpacity = co.opacity;
            });
            changed();
          }
        }
      }}
    />
  );
}

export default BaseColorField;
