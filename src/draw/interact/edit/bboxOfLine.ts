import * as SVG from '@svgdotjs/svg.js';
import { interpretNumber } from 'Draw/svg/interpretNumber';
import { direction2D as direction } from 'Math/points/direction';

export function bboxOfLine(line: SVG.Line): SVG.Box {
  let bbox = line.bbox();

  // bbox method doesn't seem to account for stroke width
  let strokeWidth = interpretNumber(line.attr('stroke-width'));
  if (strokeWidth) {
    let sw = strokeWidth.valueOf();
    let a = direction({ x: bbox.width, y: bbox.height }) - (Math.PI / 2);
    bbox = new SVG.Box(
      bbox.x - Math.abs((sw / 2) * Math.cos(a)),
      bbox.y - Math.abs((sw / 2) * Math.sin(a)),
      bbox.width + Math.abs(sw * Math.cos(a)),
      bbox.height + Math.abs(sw * Math.sin(a)),
    );
  }

  return bbox;
}
