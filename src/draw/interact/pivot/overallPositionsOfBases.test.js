import NodeSVG from 'Draw/NodeSVG';
import Drawing from 'Draw/Drawing';
import { overallPositionsOfBases } from './overallPositionsOfBases';

function expectToHaveSameSizeAndElements(expected, received) {
  expect(received.size).toBe(expected.size);
  expected.forEach(e => {
    expect(received.has(e)).toBeTruthy();
  });
}

let container = null;

let drawing = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  drawing = new Drawing();
  drawing.addTo(container, () => NodeSVG());
});

afterEach(() => {
  drawing = null;

  container.remove();
  container = null;
});

it('empty drawing and empty list of bases', () => {
  expect(drawing.isEmpty()).toBeTruthy();
  expect(overallPositionsOfBases(drawing, []).size).toBe(0);
});

it('empty list of bases', () => {
  drawing.appendSequenceOutOfView('asdf', 'asdfqwerzxcv');
  expect(overallPositionsOfBases(drawing, []).size).toBe(0);
});

it('one sequence', () => {
  drawing.appendSequenceOutOfView('qwer', 'qwerQWERqwer');
  let ps = new Set([3, 6, 8, 9, 11]);
  let bs = [];
  ps.forEach(p => bs.push(drawing.getBaseAtOverallPosition(p)));
  expectToHaveSameSizeAndElements(
    ps,
    overallPositionsOfBases(drawing, bs),
  );
});

it('multiple sequences', () => {
  drawing.appendSequenceOutOfView('asdf', 'asdf');
  drawing.appendSequenceOutOfView('qwer', 'qwerQWER');
  drawing.appendSequenceOutOfView('zxcv', 'zxcvZX');
  let ps = new Set([2, 8, 9, 15, 18]);
  let bs = [];
  ps.forEach(p => bs.push(drawing.getBaseAtOverallPosition(p)));
  expectToHaveSameSizeAndElements(
    ps,
    overallPositionsOfBases(drawing, bs),
  );
});
