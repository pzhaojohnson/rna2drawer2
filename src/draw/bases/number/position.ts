import type { BaseNumbering } from './BaseNumbering';
import { Point2D as Point } from 'Math/points/Point';
import { normalizeAngle } from 'Math/angles/normalize';

export type Positioning = {
  baseCenter: Point;
  basePadding: number;
  lineAngle: number;
  lineLength: number;
  textPadding: number;
}

function positionLine(bn: BaseNumbering, p: Positioning) {
  let d1 = p.basePadding;
  let d2 = p.basePadding + p.lineLength;
  bn.line.attr({
    'x1': p.baseCenter.x + (d1 * Math.cos(p.lineAngle)),
    'y1': p.baseCenter.y + (d1 * Math.sin(p.lineAngle)),
    'x2': p.baseCenter.x + (d2 * Math.cos(p.lineAngle)),
    'y2': p.baseCenter.y + (d2 * Math.sin(p.lineAngle)),
  });
}

type TextPositioning = {
  x: number;
  y: number;
  textAnchor: string;
}

function textPositioning(bn: BaseNumbering, p: Positioning): TextPositioning | undefined {
  let d = p.basePadding + p.lineLength + p.textPadding;
  let tp = {
    x: p.baseCenter.x + (d * Math.cos(p.lineAngle)),
    y: p.baseCenter.y + (d * Math.sin(p.lineAngle)),
    textAnchor: 'start',
  };
  let fs = bn.text.attr('font-size');
  if (typeof fs != 'number') {
    console.error('Font size must be a number to position text of base numbering.');
  } else {
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
    return tp;
  }
}

function positionText(bn: BaseNumbering, p: Positioning) {
  let tp = textPositioning(bn, p);
  if (tp) {
    bn.text.attr({
      'x': tp.x,
      'y': tp.y,
      'text-anchor': tp.textAnchor,
    });
  }
}

export function position(bn: BaseNumbering, p: Positioning) {
  positionLine(bn, p);
  positionText(bn, p);
}
