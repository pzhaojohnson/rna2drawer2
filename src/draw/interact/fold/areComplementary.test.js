import areComplementary from './areComplementary';
import StrictDrawing from '../../StrictDrawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import FoldingMode from './FoldingMode';

let sd = new StrictDrawing();
sd.addTo(document.body, () => NodeSVG());
let mode = new FoldingMode(sd);

beforeEach(() => {
  mode.includeGUT = true;
  mode.allowedMismatch = 0;
});

it('every possible pair (upper and lower case)', () => {
  let chars1 = 'AAUUGGGCaauugggc';
  let chars2 = 'UTAGCUTGutagcutg';
  chars2 = chars2.split('').reverse().join('');
  expect(areComplementary(mode, chars1, chars2)).toBeTruthy();
});

it('complementary but length mismatch', () => {
  expect(areComplementary(mode, 'AAA', 'UU')).toBeFalsy();
});

it('lengths of zero', () => {
  expect(areComplementary(mode, '', '')).toBeFalsy();
});

it('mismatch at very end', () => {
  expect(areComplementary(mode, 'aagg', 'gcuu')).toBeFalsy();
  expect(areComplementary(mode, 'aagg', 'ccua')).toBeFalsy();
});

it('mismatch in middle', () => {
  expect(areComplementary(mode, 'aagg', 'cguu')).toBeFalsy();
});

it('can exclude GUT pairs', () => {
  mode.includeGUT = false;
  expect(areComplementary(mode, 'aagg', 'uuuc')).toBeFalsy();
  expect(areComplementary(mode, 'aagg', 'uutc')).toBeFalsy();
});

it('can allow some mismatch', () => {
  mode.allowedMismatch = 0.6;
  expect(areComplementary(mode, 'aaaggg', 'cggauu')).toBeTruthy();
  mode.allowedMismatch = 0.5;
  // the mismatch is exactly the allowed mismatch
  expect(areComplementary(mode, 'aaaggg', 'cggauu')).toBeTruthy();
  mode.allowedMismatch = 0.4;
  expect(areComplementary(mode, 'aaaggg', 'cggauu')).toBeFalsy();
});

it('unrecognized characters', () => {
  expect(areComplementary(mode, 'zxc', 'qwe')).toBeFalsy();
  expect(areComplementary(mode, 'qwer', 'asdf')).toBeFalsy();
});
