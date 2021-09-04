import * as SVG from '@svgdotjs/svg.js';
import { removeInvisibleLines } from './invisible';
import { resetTextDominantBaselines } from './resetTextDominantBaselines';
import { scale } from './scale/scale';
import { crudeBoundingBox } from './bounding';
import { shift } from './shift';
import { roundNumbers } from './round';

export type Options = {
  scale?: number; // factor to scale SVG document by
}

export function prepareForExport(svg: SVG.Svg, options?: Options) {
  removeInvisibleLines(svg);
  resetTextDominantBaselines(svg);

  if (typeof options?.scale == 'number') {
    scale(svg, options.scale);
  }

  let bbox = crudeBoundingBox(svg.children());
  let padding = Math.max(200, 0.1 * (bbox?.width ?? 0));
  
  shift(svg.children(), {
    x: padding - (bbox?.x ?? padding),
    y: padding - (bbox?.y ?? padding),
  });

  let width = (2 * padding) + (bbox?.width ?? 0);
  let height = (2 * padding) + (bbox?.height ?? 0);
  svg.viewbox(0, 0, width, height);
  svg.attr({ 'width': width, 'height': height });

  roundNumbers(svg);
}
