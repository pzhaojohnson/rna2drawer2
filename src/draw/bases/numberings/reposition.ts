import type { BaseNumbering } from 'Draw/bases/numberings/BaseNumbering';
import { Point2D as Point } from 'Math/points/Point';
import { interpretNumericValue } from 'Draw/svg/interpretNumericValue';
import { normalizeAngle } from 'Math/angles/normalize';

export type Positioning = {
  baseCenter: Point;
  basePadding: number;
  lineAngle: number;
  lineLength: number;
  textPadding: number;
}

function repositionLine(bn: BaseNumbering, p: Positioning) {
  let d1 = p.basePadding;
  let d2 = p.basePadding + p.lineLength;
  bn.line.attr({
    'x1': p.baseCenter.x + (d1 * Math.cos(p.lineAngle)),
    'y1': p.baseCenter.y + (d1 * Math.sin(p.lineAngle)),
    'x2': p.baseCenter.x + (d2 * Math.cos(p.lineAngle)),
    'y2': p.baseCenter.y + (d2 * Math.sin(p.lineAngle)),
  });
}

function repositionText(bn: BaseNumbering, p: Positioning) {
  let d = p.basePadding + p.lineLength + p.textPadding;
  let tp = {
    x: p.baseCenter.x + (d * Math.cos(p.lineAngle)),
    y: p.baseCenter.y + (d * Math.sin(p.lineAngle)),
    textAnchor: 'start',
  };

  let fs = interpretNumericValue(bn.text.attr('font-size'))?.valueOf() ?? 0;
  fs *= 0.8; // helps vertical centering

  let la = normalizeAngle(p.lineAngle, 0);
  if (la < Math.PI / 4) {
    tp.y += fs / 2;
    tp.textAnchor = 'start';
  } else if (la < 3 * Math.PI / 4) {
    tp.y += fs;
    tp.textAnchor = 'middle';
  } else if (la < 5 * Math.PI / 4) {
    tp.y += fs / 2;
    tp.textAnchor = 'end';
  } else if (la < 7 * Math.PI / 4) {
    tp.textAnchor = 'middle';
  } else {
    tp.y += fs / 2;
    tp.textAnchor = 'start';
  }

  bn.text.attr({
    'x': tp.x,
    'y': tp.y,
    'text-anchor': tp.textAnchor,
  });
}

export function reposition(bn: BaseNumbering, p: Positioning) {
  repositionLine(bn, p);
  repositionText(bn, p);
}
