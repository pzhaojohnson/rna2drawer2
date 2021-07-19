import * as React from 'react';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { ColorField, ColorAndOpacity } from '../../fields/color/ColorField';
import * as Svg from '@svgdotjs/svg.js';
import { parseColor } from 'Parse/parseColor';
import { areAllSameColor } from '../../fields/color/areAllSameColor';

function baseFills(bs: Base[]): Svg.Color[] {
  let fs = [] as Svg.Color[];
  bs.forEach(b => {
    let f = parseColor(b.text.attr('fill'));
    if (f) {
      fs.push(f);
    }
  });
  return fs;
}

function baseFillOpacities(bs: Base[]): number[] {
  let fos = [] as number[];
  bs.forEach(b => {
    let fo = b.text.attr('fill-opacity');
    if (typeof fo == 'number') {
      fos.push(fo);
    }
  });
  return fos;
}

function basesAllHaveSameColor(bs: Base[]): boolean {
  return areAllSameColor(baseFills(bs));
}

export function BaseColorField(selectedBases: () => Base[], pushUndo: () => void, changed: () => void): React.ReactElement {
  let bs = selectedBases();
  let b1 = bs[0];
  let f1 = parseColor(b1.text.attr('fill'));
  let initialValue = undefined;
  if (basesAllHaveSameColor(bs) && f1) {
    initialValue = { color: f1.toHex(), opacity: 1 };
  }
  return (
    <ColorField
      name={'Base Color'}
      disableAlpha={true} // since text transparency cannot be set when exporting PPTX files
      initialValue={initialValue}
      set={co => {
        let bs = selectedBases();
        let b1 = bs[0];
        if (b1) {
          if (!basesAllHaveSameColor(bs) || co.color != b1.text.attr('fill')) {
            pushUndo();
            bs.forEach(b => {
              b.text.attr({ 'fill': co.color });
            });
            changed();
          }
        }
      }}
    />
  );
}

export default BaseColorField;
