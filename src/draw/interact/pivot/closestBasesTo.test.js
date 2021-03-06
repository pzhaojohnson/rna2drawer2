import NodeSVG from 'Draw/NodeSVG';
import Drawing from 'Draw/Drawing';
import { closestBasesTo } from './closestBasesTo';

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

it('returns closest bases to given point', () => {
  drawing.appendSequenceOutOfView('asdf', 'asdfasdfQWER');
  drawing.appendSequenceOutOfView('qwer', 'qwerQWER');
  drawing.forEachBase(b => {
    b.moveTo(
      100 * Math.random(),
      100 * Math.random(),
    );
  });
  let bs = [
    drawing.getBaseAtOverallPosition(2),
    drawing.getBaseAtOverallPosition(4),
    drawing.getBaseAtOverallPosition(5),
    drawing.getBaseAtOverallPosition(14),
    drawing.getBaseAtOverallPosition(16),
  ];
  let pt = { x: 1000, y: 1000 };
  bs.forEach(b => {
    b.moveTo(b.xCenter + pt.x, b.yCenter + pt.y);
  });
  let received = closestBasesTo(drawing, pt, bs.length);
  expect(received.length).toBe(bs.length);
  bs.forEach(b => {
    expect(received.find(r => r.id == b.id)).toBeTruthy();
  });
});

it('returns a positive number of bases by default', () => {
  drawing.appendSequenceOutOfView('asdf', 'asdfasdfqwer');
  drawing.forEachBase(b => {
    b.moveTo(
      250 * Math.random(),
      500 * Math.random(),
    );
  });
  let pt = { x: 250, y: 500 };
  let received = closestBasesTo(drawing, pt);
  expect(received.length).toBeGreaterThan(0);
});

it('n is greater than number of bases', () => {
  drawing.appendSequenceOutOfView('asdf', 'asdfasdfqwer');
  drawing.forEachBase(b => {
    b.moveTo(
      250 * Math.random(),
      500 * Math.random(),
    );
  });
  let pt = { x: 250, y: 500 };
  let n = drawing.numBases + 20;
  let received = closestBasesTo(drawing, pt, n);
  expect(received.length).toBe(drawing.numBases);
});

it('n is less than or eqaul to zero', () => {
  drawing.appendSequenceOutOfView('asdf', 'asdfasdfqwer');
  drawing.forEachBase(b => {
    b.moveTo(
      250 * Math.random(),
      500 * Math.random(),
    );
  });
  let pt = { x: 250, y: 500 };
  expect(closestBasesTo(drawing, pt, 0)).toStrictEqual([]);
  expect(closestBasesTo(drawing, pt, -5)).toStrictEqual([]);
});
