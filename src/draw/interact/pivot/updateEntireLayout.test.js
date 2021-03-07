import NodeSVG from 'Draw/NodeSVG';
import StrictDrawing from 'Draw/StrictDrawing';
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
  strictDrawing.drawing.addSecondaryBond(
    strictDrawing.drawing.getBaseAtOverallPosition(5),
    strictDrawing.drawing.getBaseAtOverallPosition(12),
  );
  strictDrawing.drawing.setWidthAndHeight(0, 0);
  updateEntireLayout(strictDrawing);
  expectScrollingToBeFinite(strictDrawing);
});

it('handles a drawing with zero zoom', () => {
  strictDrawing.appendSequence('asdf', 'asdfQWERasdf');
  strictDrawing.drawing.addSecondaryBond(
    strictDrawing.drawing.getBaseAtOverallPosition(1),
    strictDrawing.drawing.getBaseAtOverallPosition(6),
  );
  strictDrawing.drawing.zoom = 0;
  updateEntireLayout(strictDrawing);
  expectScrollingToBeFinite(strictDrawing);
});
