import type { StraightBond } from './StraightBond';
import { distance2D as distance } from 'Math/distance';

export type Positioning = {
  basePadding1: number;
  basePadding2: number;
}

export function position(sb: StraightBond, p: Positioning) {
  let baseCenter1 = { x: sb.base1.xCenter, y: sb.base1.yCenter };
  let baseCenter2 = { x: sb.base2.xCenter, y: sb.base2.yCenter };
  let a = Math.atan2(
    baseCenter2.y - baseCenter1.y,
    baseCenter2.x - baseCenter1.x,
  );
  sb.line.attr({
    'x1': baseCenter1.x + (p.basePadding1 * Math.cos(a)),
    'y1': baseCenter1.y + (p.basePadding1 * Math.sin(a)),
    'x2': baseCenter2.x - (p.basePadding2 * Math.cos(a)),
    'y2': baseCenter2.y - (p.basePadding2 * Math.sin(a)),
  });
  let d = distance(baseCenter1.x, baseCenter1.y, baseCenter2.x, baseCenter2.y);
  if (d < p.basePadding1 + p.basePadding2) {
    sb.line.attr({ 'opacity': 0 });
  } else {
    sb.line.attr({ 'opacity': 1 });
  }
}
