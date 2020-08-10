import * as React from 'react';
import { BaseInterface as Base } from '../../../draw/BaseInterface';
import { ColorField, ColorAndOpacity } from '../../fields/color/ColorField';
import * as Svg from '@svgdotjs/svg.js';
import MostRecentOutlineProps from './MostRecentOutlineProps';

function _sharedOutlineStrokeColor(bs: Base[]): string | undefined {
  let strokes = new Set<string>();
  let lastAdded = undefined;
  bs.forEach(b => {
    if (b.outline) {
      let c = new Svg.Color(b.outline.stroke);
      let h = c.toHex().toLowerCase();
      strokes.add(h);
      lastAdded = h;
    }
  });
  return strokes.size == 1 ? lastAdded : undefined;
}

function _sharedOutlineStrokeOpacity(bs: Base[]): number | undefined {
  let opacities = new Set<number>();
  let lastAdded = undefined;
  bs.forEach(b => {
    if (b.outline) {
      opacities.add(b.outline.strokeOpacity);
      lastAdded = b.outline.strokeOpacity;
    }
  });
  return opacities.size == 1 ? lastAdded : undefined;
}

function _sharedOutlineStrokeColorAndOpacity(bs: Base[]): ColorAndOpacity | undefined {
  let color = _sharedOutlineStrokeColor(bs);
  let opacity = _sharedOutlineStrokeOpacity(bs);
  if (color && (opacity || opacity == 0)) {
    return { color: color, opacity: opacity };
  } else {
    return undefined;
  }
}

export function OutlineStrokeField(selectedBases: () => Base[], pushUndo: () => void, changed: () => void): React.ReactElement {
  return (
    <ColorField
      name={'Line Color'}
      initialValue={_sharedOutlineStrokeColorAndOpacity(selectedBases())}
      set={co => {
        let bs = selectedBases();
        if (bs.length == 0) {
          return;
        }
        let shared = _sharedOutlineStrokeColorAndOpacity(bs);
        if (!shared || co.color != shared.color || co.opacity != shared.opacity) {
          pushUndo();
          bs.forEach(b => {
            if (b.outline) {
              b.outline.stroke = co.color;
              b.outline.strokeOpacity = co.opacity;
            }
          });
          MostRecentOutlineProps.stroke = co.color;
          MostRecentOutlineProps.strokeOpacity = co.opacity;
          changed();
        }
      }}
    />
  );
}

export default OutlineStrokeField;
