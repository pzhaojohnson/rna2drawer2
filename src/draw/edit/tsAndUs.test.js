import {
  hasTs,
  hasUs,
  tsToUs,
  usToTs,
} from './tsAndUs';
import Drawing from '../Drawing';
import NodeSVG from '../NodeSVG';

it('hasTs function', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  // test handling of multiple sequences
  let seq1 = drawing.appendSequenceOutOfView('asdf', 'asdfu');
  let seq2 = drawing.appendSequenceOutOfView('qwer', 'qwUerqwer');
  let seq3 = drawing.appendSequenceOutOfView('zxcv', 'zzx');
  // has lowercase and uppercase Us but no Ts
  expect(hasTs(drawing)).toBeFalsy();
  // add a lowercase T
  seq2.getBaseAtPosition(5).character = 't';
  expect(hasTs(drawing)).toBeTruthy();
  // remove lowercase T
  seq2.getBaseAtPosition(5).character = 'q';
  expect(hasTs(drawing)).toBeFalsy();
  // add an uppercase T
  seq3.getBaseAtPosition(2).character = 'T';
  expect(hasTs(drawing)).toBeTruthy();
});

it('hasUs function', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  // test handling of multiple sequences
  let seq1 = drawing.appendSequenceOutOfView('qwer', 'qwttnm');
  let seq2 = drawing.appendSequenceOutOfView('zxcv', 'zTqw');
  let seq3 = drawing.appendSequenceOutOfView('asdf', 'asdfasdf');
  // has lowercase and uppercase Ts but no Us
  expect(hasUs(drawing)).toBeFalsy();
  // add a lowercase U
  seq3.getBaseAtPosition(4).character = 'u';
  expect(hasUs(drawing)).toBeTruthy();
  // remove lowercase U
  seq3.getBaseAtPosition(4).character = 'i';
  expect(hasUs(drawing)).toBeFalsy();
  // add an uppercase U
  seq2.getBaseAtPosition(3).character = 'U';
  expect(hasUs(drawing)).toBeTruthy();
});

it('tsToUs and usToTs functions', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  // test handling of multiple sequences
  let seq1 = drawing.appendSequenceOutOfView('qwer', 'qwuUqet');
  let seq2 = drawing.appendSequenceOutOfView('zxcv', 'tUzx');
  let seq3 = drawing.appendSequenceOutOfView('asdf', 'asTq');
  // converting lowercase and uppercase Ts to Us
  tsToUs(drawing);
  expect(drawing.overallCharacters).toBe('qwuUqeuuUzxasUq');
  // coverting lowercase and uppercase Us to Ts
  usToTs(drawing);
  expect(drawing.overallCharacters).toBe('qwtTqettTzxasTq');
});
