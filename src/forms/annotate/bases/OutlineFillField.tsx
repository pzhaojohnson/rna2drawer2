import * as React from 'react';
import { BaseInterface as Base } from '../../../draw/BaseInterface';
import { ColorField, ColorAndOpacity } from '../../fields/color/ColorField';
import * as Svg from '@svgdotjs/svg.js';

function _sharedOutlineFillColor(bs: Base[]): string | undefined {
  let colors = new Set<string>();
  let lastAdded = undefined;
  bs.forEach(b => {
    if (b.outline) {
      let c = new Svg.Color(b.outline.fill);
      let h = c.toHex().toLowerCase();
      colors.add(h);
      lastAdded = h;
    }
  });
  return colors.size == 1 ? lastAdded : undefined;
}

function _sharedOutlineFillOpacity(bs: Base[]): number | undefined {
  let opacities = new Set<number>();
  let lastAdded = undefined;
  bs.forEach(b => {
    if (b.outline) {
      opacities.add(b.outline.fillOpacity);
      lastAdded = b.outline.fillOpacity;
    }
  });
  return opacities.size == 1 ? lastAdded : undefined;
}

function _sharedOutlineFillColorAndOpacity(bs: Base[]): ColorAndOpacity | undefined {
  let color = _sharedOutlineFillColor(bs);
  let opacity = _sharedOutlineFillOpacity(bs);
  if (color && (opacity || opacity == 0)) {
    return { color: color, opacity: opacity };
  } else {
    return undefined;
  }
}

export function OutlineFillField(selectedBases: () => Base[], pushUndo: () => void, changed: () => void): React.ReactElement {
  return (
    <ColorField
      name={'Fill'}
      initialValue={_sharedOutlineFillColorAndOpacity(selectedBases())}
      set={co => {
        let bs = selectedBases();
        if (bs.length == 0) {
          return;
        }
        let shared = _sharedOutlineFillColorAndOpacity(bs);
        if (!shared || co.color != shared.color || co.opacity != shared.opacity) {
          pushUndo();
          bs.forEach(b => {
            if (b.outline) {
              b.outline.fill = co.color;
              b.outline.fillOpacity = co.opacity;
            }
          });
          changed();
        }
      }}
    />
  );
}

export default OutlineFillField;
