import { StrictDrawing } from 'Draw/strict/StrictDrawing';
import * as SVG from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { addTertiaryBond } from 'Draw/bonds/curved/add';

import { removeTertiaryBonds } from './removeTertiaryBonds';

let container = null;
let strictDrawing = null;
let tertiaryBonds = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  strictDrawing = new StrictDrawing({ SVG });
  strictDrawing.appendTo(container);

  let sequence = appendSequence(strictDrawing.drawing, { id: 'asdf', characters: 'asdfASDFqwerQWER' });

  tertiaryBonds = [
    addTertiaryBond(strictDrawing.drawing, sequence.atPosition(1), sequence.atPosition(5)),
    addTertiaryBond(strictDrawing.drawing, sequence.atPosition(5), sequence.atPosition(9)),
    addTertiaryBond(strictDrawing.drawing, sequence.atPosition(2), sequence.atPosition(3)),
    addTertiaryBond(strictDrawing.drawing, sequence.atPosition(11), sequence.atPosition(2)),
    addTertiaryBond(strictDrawing.drawing, sequence.atPosition(12), sequence.atPosition(10)),
    addTertiaryBond(strictDrawing.drawing, sequence.atPosition(5), sequence.atPosition(6)),
    addTertiaryBond(strictDrawing.drawing, sequence.atPosition(9), sequence.atPosition(9)),
    addTertiaryBond(strictDrawing.drawing, sequence.atPosition(1), sequence.atPosition(10)),
    addTertiaryBond(strictDrawing.drawing, sequence.atPosition(3), sequence.atPosition(4)),
    addTertiaryBond(strictDrawing.drawing, sequence.atPosition(12), sequence.atPosition(3)),
    addTertiaryBond(strictDrawing.drawing, sequence.atPosition(8), sequence.atPosition(2)),
  ];
});

afterEach(() => {
  tertiaryBonds = null;
  strictDrawing = null;

  container.remove();
  container = null;
});

describe('removeTertiaryBonds function', () => {
  test('an empty array of tertiary bonds', () => {
    let n = strictDrawing.drawing.tertiaryBonds.length;
    removeTertiaryBonds(strictDrawing, []);
    expect(strictDrawing.drawing.tertiaryBonds.length).toBe(n); // didn't change
  });

  test('removing one tertiary bond', () => {
    let n = strictDrawing.drawing.tertiaryBonds.length;
    let tb = tertiaryBonds[2];
    expect(strictDrawing.drawing.tertiaryBonds.includes(tb)).toBeTruthy();
    removeTertiaryBonds(strictDrawing, [tb]);
    expect(strictDrawing.drawing.tertiaryBonds.length).toBe(n - 1);
    expect(strictDrawing.drawing.tertiaryBonds.includes(tb)).toBeFalsy();
  });

  test('removing multiple tertiary bonds', () => {
    let n = strictDrawing.drawing.tertiaryBonds.length;
    let tbs = [
      tertiaryBonds[1],
      tertiaryBonds[6],
      tertiaryBonds[3],
    ];
    expect(tbs.every(tb => strictDrawing.drawing.tertiaryBonds.includes(tb))).toBeTruthy();
    removeTertiaryBonds(strictDrawing, tbs);
    expect(strictDrawing.drawing.tertiaryBonds.length).toBe(n - 3);
    expect(tbs.every(tb => !strictDrawing.drawing.tertiaryBonds.includes(tb))).toBeTruthy();
  });

  test('when a tertiary bond has already been removed', () => {
    let tb = tertiaryBonds[2];
    removeTertiaryBonds(strictDrawing, [tb]);
    let n = strictDrawing.drawing.tertiaryBonds.length;
    expect(strictDrawing.drawing.tertiaryBonds.includes(tb)).toBeFalsy();
    removeTertiaryBonds(strictDrawing, [tb]); // try removing again
    expect(strictDrawing.drawing.tertiaryBonds.length).toBe(n); // didn't change
    expect(strictDrawing.drawing.tertiaryBonds.includes(tb)).toBeFalsy();
  });
});
