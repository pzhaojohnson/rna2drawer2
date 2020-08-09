import * as React from 'react';
import { BaseInterface as Base } from '../../../draw/BaseInterface';
import { ColorField, ColorAndOpacity } from '../../fields/color/ColorField';
import * as Svg from '@svgdotjs/svg.js';

function _sharedBaseFill(bs: Base[]): string | undefined {
  let colors = new Set<string>();
  let lastAdded = undefined;
  bs.forEach(b => {
    let c = new Svg.Color(b.fill);
    let h = c.toHex().toLowerCase();
    colors.add(h);
    lastAdded = h;
  });
  return colors.size == 1 ? lastAdded : undefined;
}

function _sharedBaseFillOpacity(bs: Base[]): number | undefined {
  let opacities = new Set<number>();
  let lastAdded = undefined;
  bs.forEach(b => {
    opacities.add(b.fillOpacity);
    lastAdded = b.fillOpacity;
  });
  return opacities.size == 1 ? lastAdded : undefined;
}

function _sharedBaseColorAndOpacity(bs: Base[]): ColorAndOpacity | undefined {
  let color = _sharedBaseFill(bs);
  let opacity = _sharedBaseFillOpacity(bs);
  if (color && (opacity || opacity == 0)) {
    return { color: color, opacity: opacity };
  } else {
    return undefined;
  }
}

export function BaseColorField(selectedBases: () => Base[], pushUndo: () => void, changed: () => void): React.ReactElement {
  return (
    <ColorField
      name={'Base Color'}
      initialValue={_sharedBaseColorAndOpacity(selectedBases())}
      set={co => {
        let bs = selectedBases();
        if (bs.length == 0) {
          return;
        }
        let shared = _sharedBaseColorAndOpacity(bs);
        if (!shared || co.color != shared.color || co.opacity != shared.opacity) {
          pushUndo();
          bs.forEach(b => {
            b.fill = co.color;
            b.fillOpacity = co.opacity;
          });
          changed();
        }
      }}
    />
  );
}

export default BaseColorField;
