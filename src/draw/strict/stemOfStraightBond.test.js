import { StrictDrawing } from 'Draw/strict/StrictDrawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { addPrimaryBond } from 'Draw/bonds/straight/add';
import { addSecondaryBond } from 'Draw/bonds/straight/add';
import { createStem } from 'Partners/Stem';

import { stemOfStraightBond } from './stemOfStraightBond';

let container = null;
let strictDrawing = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  strictDrawing = new StrictDrawing({ SVG: { SVG: NodeSVG } });
  strictDrawing.appendTo(container);
});

afterEach(() => {
  strictDrawing = null;

  container.remove();
  container = null;
});

test('stemOfStraightBond function', () => {

  // test multiple sequences
  appendSequence(strictDrawing.drawing, {
    id: 'QWER',
    characters: 'aazz1234',
  });
  appendSequence(strictDrawing.drawing, {
    id: 'asdf',
    characters: 'QQQQ',
  });
  appendSequence(strictDrawing.drawing, {
    id: 'ZXCV',
    characters: 'zzxxccvv',
  });
  let seq = strictDrawing.layoutSequence();

  // add a hairpin
  let sb1 = addSecondaryBond(strictDrawing.drawing, seq.atPosition(3), seq.atPosition(11));
  let sb2 = addSecondaryBond(strictDrawing.drawing, seq.atPosition(4), seq.atPosition(10));
  let sb3 = addSecondaryBond(strictDrawing.drawing, seq.atPosition(5), seq.atPosition(9));
  let stem1 = createStem({ bottomPair: [3, 11], size: 3 });
  expect(stemOfStraightBond(strictDrawing, sb1)).toStrictEqual(stem1);
  expect(stemOfStraightBond(strictDrawing, sb2)).toStrictEqual(stem1);
  expect(stemOfStraightBond(strictDrawing, sb3)).toStrictEqual(stem1);

  // add another hairpin
  let sb4 = addSecondaryBond(strictDrawing.drawing, seq.atPosition(12), seq.atPosition(18));
  let sb5 = addSecondaryBond(strictDrawing.drawing, seq.atPosition(13), seq.atPosition(17));
  let stem2 = createStem({ bottomPair: [12, 18], size: 2 });
  expect(stemOfStraightBond(strictDrawing, sb4)).toStrictEqual(stem2);
  expect(stemOfStraightBond(strictDrawing, sb5)).toStrictEqual(stem2);

  // neither base 1 nor 2 are in a stem
  let pb1 = addPrimaryBond(strictDrawing.drawing, seq.atPosition(1), seq.atPosition(2));
  expect(stemOfStraightBond(strictDrawing, pb1)).toBeUndefined();

  // only base 2 is in a stem
  let pb2 = addPrimaryBond(strictDrawing.drawing, seq.atPosition(2), seq.atPosition(3));
  expect(stemOfStraightBond(strictDrawing, pb2)).toBeUndefined();

  // only base 1 is in a stem
  let pb3 = addPrimaryBond(strictDrawing.drawing, seq.atPosition(5), seq.atPosition(6));
  expect(stemOfStraightBond(strictDrawing, pb3)).toBeUndefined();

  // bases 1 and 2 are in different stems
  let pb4 = addPrimaryBond(strictDrawing.drawing, seq.atPosition(11), seq.atPosition(12));
  expect(stemOfStraightBond(strictDrawing, pb4)).toBeUndefined();

  // bases 1 and 2 are in the same stem
  let pb5 = addPrimaryBond(strictDrawing.drawing, seq.atPosition(9), seq.atPosition(10));
  expect(stemOfStraightBond(strictDrawing, pb5)).toStrictEqual(stem1);
});
