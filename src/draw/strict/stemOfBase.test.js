import { StrictDrawing } from 'Draw/strict/StrictDrawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { addSecondaryBond } from 'Draw/bonds/straight/add';
import { createStem } from 'Partners/Stem';

import { stemOfBase } from './stemOfBase';

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

test('stemOfBase function', () => {
  let seq = appendSequence(strictDrawing.drawing, {
    id: 'asdf',
    characters: 'asdfQWERzxcv',
  });

  // add a hairpin
  addSecondaryBond(strictDrawing.drawing, seq.atPosition(2), seq.atPosition(10));
  addSecondaryBond(strictDrawing.drawing, seq.atPosition(3), seq.atPosition(9));
  addSecondaryBond(strictDrawing.drawing, seq.atPosition(4), seq.atPosition(8));
  let stem = createStem({ bottomPair: [2, 10], size: 3 });

  // before hairpin
  expect(stemOfBase(strictDrawing, seq.atPosition(1))).toBeUndefined();

  // in upstream side of hairpin stem
  expect(stemOfBase(strictDrawing, seq.atPosition(2))).toStrictEqual(stem);
  expect(stemOfBase(strictDrawing, seq.atPosition(3))).toStrictEqual(stem);
  expect(stemOfBase(strictDrawing, seq.atPosition(4))).toStrictEqual(stem);

  // in hairpin loop
  expect(stemOfBase(strictDrawing, seq.atPosition(5))).toBeUndefined();
  expect(stemOfBase(strictDrawing, seq.atPosition(6))).toBeUndefined();
  expect(stemOfBase(strictDrawing, seq.atPosition(7))).toBeUndefined();

  // in downstream side of hairpin stem
  expect(stemOfBase(strictDrawing, seq.atPosition(8))).toStrictEqual(stem);
  expect(stemOfBase(strictDrawing, seq.atPosition(9))).toStrictEqual(stem);
  expect(stemOfBase(strictDrawing, seq.atPosition(10))).toStrictEqual(stem);

  // after hairpin
  expect(stemOfBase(strictDrawing, seq.atPosition(11))).toBeUndefined();
  expect(stemOfBase(strictDrawing, seq.atPosition(12))).toBeUndefined();
});
