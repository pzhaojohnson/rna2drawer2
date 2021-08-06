import {
  hasCapitalBaseLetters,
  onlyHasCapitalBaseLetters,
  capitalizeBaseLetters,
  decapitalizeBaseLetters,
} from './capitalize';
import Drawing from '../Drawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';

it('hasCapitalBaseLetters function', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  // add multiple sequences
  drawing.appendSequence('asdf', 'asdf');
  drawing.appendSequence('qwer', 'qwer');
  expect(hasCapitalBaseLetters(drawing)).toBeFalsy();
  drawing.appendSequence('aSdf', 'aSdf');
  expect(hasCapitalBaseLetters(drawing)).toBeTruthy();
  let b = drawing.getBaseAtOverallPosition(10);
  b.character = 's';
  expect(hasCapitalBaseLetters(drawing)).toBeFalsy();
});

it('onlyHasCapitalBaseLetters function', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  // test handling of multiple sequences
  let seq1 = drawing.appendSequence('qwer', 'QWER');
  let seq2 = drawing.appendSequence('asdf', 'ASDFASDF');
  // only has uppercase letters
  expect(onlyHasCapitalBaseLetters(drawing)).toBeTruthy();
  // add a lowercase letter
  seq2.getBaseAtPosition(3).character = 'd';
  expect(onlyHasCapitalBaseLetters(drawing)).toBeFalsy();
});

it('capitalizeBaseLetters function', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  // add multiple sequences
  drawing.appendSequence('zxcv', 'ZxCV');
  drawing.appendSequence('qwerqw', 'qwERqw');
  drawing.appendSequence('asd', 'asd');
  capitalizeBaseLetters(drawing);
  expect(drawing.overallCharacters).toBe('ZXCVQWERQWASD');
});

it('decapitalizeBaseLetters function', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  // add multiple sequences
  drawing.appendSequence('ghjk', 'Ghjk');
  drawing.appendSequence('qwer', 'QWer');
  drawing.appendSequence('zxc', 'zXC');
  decapitalizeBaseLetters(drawing);
  expect(drawing.overallCharacters).toBe('ghjkqwerzxc');
});
