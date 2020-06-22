import {
  hasCapitalBaseLetters,
  capitalizeBaseLetters,
  decapitalizeBaseletters,
} from './capitalize';
import Drawing from '../Drawing';
import NodeSVG from '../NodeSVG';

it('hasCapitalBaseLetters function', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  // add multiple sequences
  drawing.appendSequenceOutOfView('asdf', 'asdf');
  drawing.appendSequenceOutOfView('qwer', 'qwer');
  expect(hasCapitalBaseLetters(drawing)).toBeFalsy();
  drawing.appendSequenceOutOfView('aSdf', 'aSdf');
  expect(hasCapitalBaseLetters(drawing)).toBeTruthy();
  let b = drawing.getBaseAtOverallPosition(10);
  b.character = 's';
  expect(hasCapitalBaseLetters(drawing)).toBeFalsy();
});

it('capitalizeBaseLetters function', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  // add multiple sequences
  drawing.appendSequenceOutOfView('zxcv', 'ZxCV');
  drawing.appendSequenceOutOfView('qwerqw', 'qwERqw');
  drawing.appendSequenceOutOfView('asd', 'asd');
  capitalizeBaseLetters(drawing);
  expect(drawing.overallCharacters).toBe('ZXCVQWERQWASD');
});

it('decapitalizeBaseLetters function', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  // add multiple sequences
  drawing.appendSequenceOutOfView('ghjk', 'Ghjk');
  drawing.appendSequenceOutOfView('qwer', 'QWer');
  drawing.appendSequenceOutOfView('zxc', 'zXC');
  decapitalizeBaseletters(drawing);
  expect(drawing.overallCharacters).toBe('ghjkqwerzxc');
});
