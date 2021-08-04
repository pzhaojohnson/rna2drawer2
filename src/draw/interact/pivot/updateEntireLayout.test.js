import { NodeSVG } from 'Draw/svg/NodeSVG';
import StrictDrawing from 'Draw/StrictDrawing';
import { addSecondaryBond } from 'Draw/bonds/straight/add';
import { updateEntireLayout } from './updateEntireLayout';

function expectToBeFinite(n) {
  expect(Number.isFinite(n)).toBeTruthy();
}

function expectScrollingToBeFinite(strictDrawing) {
  expectToBeFinite(strictDrawing.drawing.scrollLeft);
  expectToBeFinite(strictDrawing.drawing.scrollTop);
}

let container = null;

let strictDrawing = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  strictDrawing = new StrictDrawing();
  strictDrawing.addTo(container, () => NodeSVG());
});

afterEach(() => {
  strictDrawing = null;

  container.remove();
  container = null;
});

it('handles an empty drawing', () => {
  expect(strictDrawing.isEmpty()).toBeTruthy();
  updateEntireLayout(strictDrawing);
  expectScrollingToBeFinite(strictDrawing);
});

it('handles a drawing with zero area', () => {
  strictDrawing.appendSequence('asdf', 'asdfQWERasdfQQQQ');
  addSecondaryBond(
    strictDrawing.drawing,
    strictDrawing.drawing.getBaseAtOverallPosition(5),
    strictDrawing.drawing.getBaseAtOverallPosition(12),
  );
  strictDrawing.drawing.setWidthAndHeight(0, 0);
  updateEntireLayout(strictDrawing);
  expectScrollingToBeFinite(strictDrawing);
});

it('handles a drawing with zero zoom', () => {
  strictDrawing.appendSequence('asdf', 'asdfQWERasdf');
  addSecondaryBond(
    strictDrawing.drawing,
    strictDrawing.drawing.getBaseAtOverallPosition(1),
    strictDrawing.drawing.getBaseAtOverallPosition(6),
  );
  strictDrawing.drawing.zoom = 0;
  updateEntireLayout(strictDrawing);
  expectScrollingToBeFinite(strictDrawing);
});

it('view reference is specified', () => {
  strictDrawing.appendSequence('qwer', 'QQPPOzxcvnskdhfu');
  addSecondaryBond(
    strictDrawing.drawing,
    strictDrawing.drawing.getBaseAtOverallPosition(6),
    strictDrawing.drawing.getBaseAtOverallPosition(12),
  );
  updateEntireLayout(strictDrawing, { viewReference: 8 });
  expectScrollingToBeFinite(strictDrawing);
});

it('handles out of bounds view reference', () => {
  strictDrawing.appendSequence('qwer', 'QQPPOzxcvnskdhfu');
  addSecondaryBond(
    strictDrawing.drawing,
    strictDrawing.drawing.getBaseAtOverallPosition(6),
    strictDrawing.drawing.getBaseAtOverallPosition(12),
  );
  let vf = strictDrawing.drawing.numBases + 20;
  expect(strictDrawing.drawing.getBaseAtOverallPosition(vf)).toBeFalsy();
  updateEntireLayout(strictDrawing, { viewReference: vf });
  expectScrollingToBeFinite(strictDrawing);
});
