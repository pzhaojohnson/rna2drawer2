import adjustBaseNumbering from './adjustBaseNumbering';
import Drawing from '../Drawing';
import NodeSVG from '../NodeSVG';
import { addNumbering } from 'Draw/bases/number/add';
import { addSecondaryBond } from 'Draw/bonds/straight/add';
import normalizeAngle from '../normalizeAngle';

it('sets line angles to outer normal', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  let seq = drawing.appendSequenceOutOfView('asdf', 'asd');
  let b1 = seq.getBaseAtPosition(1);
  let b2 = seq.getBaseAtPosition(2);
  let b3 = seq.getBaseAtPosition(3);
  b1.moveTo(0, 0);
  b2.moveTo(-1, -1);
  b3.moveTo(0, -2);
  addNumbering(b2, 2);
  let n = b2.numbering;
  n.lineAngle = 0;
  adjustBaseNumbering(drawing);
  expect(normalizeAngle(n.lineAngle)).toBeCloseTo(Math.PI);
});

describe('prevents overlaps with secondary bonds for bases 1 and 2', () => {
  it('secondary bond paddings are too large for distance between bases', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => NodeSVG());
    let seq = drawing.appendSequenceOutOfView('asdf', 'qwezxc');
    seq.getBaseAtPosition(1).moveTo(0, 0);
    seq.getBaseAtPosition(2).moveTo(1, -1);
    seq.getBaseAtPosition(3).moveTo(0, -2);
    seq.getBaseAtPosition(4).moveTo(3, 0);
    seq.getBaseAtPosition(5).moveTo(2, -1);
    seq.getBaseAtPosition(6).moveTo(3, -2);
    let b2 = seq.getBaseAtPosition(2);
    let b5 = seq.getBaseAtPosition(5);
    let sb = addSecondaryBond(drawing, b2, b5);
    sb.padding1 = 8;
    sb.padding2 = 8;
    expect(sb.padding1 + sb.padding2).toBeGreaterThan(b2.distanceBetweenCenters(b5));
    addNumbering(b2, 2);
    let n2 = b2.numbering;
    n2.lineAngle = 0;
    addNumbering(b5, 5);
    let n5 = b5.numbering;
    n5.lineAngle = Math.PI;
    expect(
      normalizeAngle(seq.outerNormalAngleAtPosition(2))
    ).toBeCloseTo(0);
    expect(
      normalizeAngle(seq.outerNormalAngleAtPosition(5))
    ).toBeCloseTo(Math.PI);
    adjustBaseNumbering(drawing);
    expect(normalizeAngle(n2.lineAngle)).toBeCloseTo(Math.PI);
    expect(normalizeAngle(n5.lineAngle)).toBeCloseTo(0);
  });
});
