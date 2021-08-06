import Drawing from '../../../../draw/Drawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { positionsToSelect } from './positionsToSelect';

let container = null;

let drawing = null;
let seq = null;

let inputs = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  drawing = new Drawing();
  drawing.addTo(container, () => NodeSVG());
  seq = drawing.appendSequence('asdf', 'asdfqwerzxcvasdfqwerzxcvasdfqwerzxcv');

  inputs = {
    startPosition: 1,
    data: [1, 2, 3, 4, 5, 6],
    dataRange: {
      min: 2,
      max: 5,
    },
  };
});

afterEach(() => {
  seq = null;
  drawing = null;
  container.remove();
  container = null;
});

it('drawing has no sequences', () => {
  drawing.clear();
  expect(drawing.numSequences).toBe(0);
  expect(typeof positionsToSelect(drawing, inputs)).toBe('string');
});

it('drawing has more than one sequence', () => {
  drawing.appendSequence('qwer', 'qwer');
  expect(drawing.numSequences).toBe(2);
  expect(typeof positionsToSelect(drawing, inputs)).toBe('string');
});

it('start position is at edges of range', () => {
  seq.numberingOffset = 12;
  inputs.startPosition = 12;
  inputs.data = [1];
  inputs.dataRange = { min: 1, max: 1 };
  expect(typeof positionsToSelect(drawing, inputs)).toBe('string');
  inputs.startPosition = 13;
  expect(positionsToSelect(drawing, inputs)).toStrictEqual([1]);
  inputs.startPosition = seq.length + seq.numberingOffset;
  expect(positionsToSelect(drawing, inputs)).toStrictEqual([seq.length]);
  inputs.startPosition = seq.length + seq.numberingOffset + 1;
  expect(typeof positionsToSelect(drawing, inputs)).toBe('string');
});

it('no data', () => {
  inputs.data = [];
  expect(typeof positionsToSelect(drawing, inputs)).toBe('string');
});

it('data goes to very end of sequence', () => {
  seq.numberingOffset = 6;
  inputs.startPosition = seq.length + seq.numberingOffset - 2;
  inputs.data = [1, 2, 3];
  inputs.dataRange = { min: 1, max: 3 };
  expect(positionsToSelect(drawing, inputs)).toStrictEqual([
    seq.length - 2,
    seq.length - 1,
    seq.length,
  ]);
});

it('data goes just past end of sequence', () => {
  seq.numberingOffset = 6;
  inputs.startPosition = seq.length + seq.numberingOffset - 2;
  inputs.data = [1, 2, 3, 3];
  inputs.dataRange = { min: 1, max: 3 };
  expect(
    (inputs.startPosition - seq.numberingOffset) + (inputs.data.length - 1)
  ).toBe(seq.length + 1);
  expect(typeof positionsToSelect(drawing, inputs)).toBe('string');
});

it('returns positions with values in range', () => {
  seq.numberingOffset = 8;
  inputs.startPosition = 12;
  inputs.data = [0.25, -1, 2, 12, 32, 48, 22.1, 9, 0.6, -10];
  inputs.dataRange = { min: 0.6, max: 22.1 };
  expect(positionsToSelect(drawing, inputs)).toStrictEqual(
    [6, 7, 10, 11, 12]
  );
});

it('min of data to select is greater than max', () => {
  inputs.dataRange = { min: 12, max: 8 };
  expect(typeof positionsToSelect(drawing, inputs)).toBe('string');
});
