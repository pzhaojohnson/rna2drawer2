import isPairable from './isPairable';
import { StrictDrawing } from 'Draw/strict/StrictDrawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import FoldingMode from './FoldingMode';
import IntegerRange from './IntegerRange';

let sd = new StrictDrawing({ SVG: { SVG: NodeSVG } });
sd.appendTo(document.body);
let mode = new FoldingMode(sd);
sd.appendSequence('asdf', 'AAAAUUUUGGGGCCCCUUUU');

it('nothing selected', () => {
  mode.selected = undefined;
  let r = new IntegerRange(5, 8);
  expect(isPairable(mode, r)).toBeFalsy();
});

it('selected range and given range are different sizes', () => {
  mode.forcePair();
  mode.selected = { tightEnd: 2, looseEnd: 5 };
  let r = new IntegerRange(8, 10);
  expect(isPairable(mode, r)).toBeFalsy();
});

describe('selected and given ranges are same size but one is out of bounds', () => {
  it('selected range is out of bounds', () => {
    mode.forcePair();
    mode.selected = { tightEnd: 18, looseEnd: 22 };
    let r = new IntegerRange(10, 14);
    expect(isPairable(mode, r)).toBeFalsy();
  });

  it('given range is out of bounds', () => {
    mode.forcePair();
    mode.selected = { tightEnd: 3, looseEnd: 8 };
    let r = new IntegerRange(16, 21);
    expect(isPairable(mode, r)).toBeFalsy();
  });
});

it('overlaps with selected', () => {
  mode.forcePair();
  mode.selected = { tightEnd: 8, looseEnd: 10 };
  let r = new IntegerRange(7, 9);
  expect(isPairable(mode, r)).toBeFalsy();
});

it('is not complementary and pairing complements', () => {
  mode.pairComplements();
  mode.selected = { tightEnd: 1, looseEnd: 4 };
  let r = new IntegerRange(13, 16);
  expect(isPairable(mode, r)).toBeFalsy();
});

it('is complementary and pairing complements', () => {
  mode.pairComplements();
  mode.selected = { tightEnd: 17, looseEnd: 20 };
  let r = new IntegerRange(9, 12);
  expect(isPairable(mode, r)).toBeTruthy();
});

it('is not complementary but not pairing complements', () => {
  mode.forcePair();
  mode.selected = { tightEnd: 1, looseEnd: 4 };
  let r = new IntegerRange(13, 16);
  expect(isPairable(mode, r)).toBeTruthy();
});
