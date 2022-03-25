import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import type { Base } from 'Draw/bases/Base';
import { TertiaryBond } from './TertiaryBond';
import { setValues } from './values';
import { distance2D as distance } from 'Math/distance';

function setControlPointDisplacement(tb: TertiaryBond) {

  // default values
  let cpd = {
    angle: 3 * Math.PI / 2,
    magnitude: 25,
  };

  // will store the distance between the bases of the bond
  let d: unknown = undefined;

  // work with variables with any types in try block
  try {
    let bbox1 = tb.base1.text.bbox();
    let bbox2 = tb.base2.text.bbox();
    d = distance(bbox1.cx, bbox1.cy, bbox2.cx, bbox2.cy);
  } catch {}

  if (typeof d == 'number' && Number.isFinite(d)) {
    cpd.magnitude = 0.35 * d;
  } else {
    console.log('Unable to calculate the distance between the bases of the tertiary bond.');
  }

  tb.setControlPointDisplacement(cpd);
}

export function addTertiaryBond(drawing: Drawing, base1: Base, base2: Base): TertiaryBond {
  let path = drawing.svg.path('M 10 20 Q 30 40 50 60');
  let tb = new TertiaryBond(path, base1, base2);
  setValues(tb, TertiaryBond.recommendedDefaults);
  drawing.tertiaryBonds.push(tb);
  setControlPointDisplacement(tb);
  return tb;
}
