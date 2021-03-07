import NodeSVG from 'Draw/NodeSVG';
import StrictDrawing from 'Draw/StrictDrawing';
import { updateLayout } from './updateLayout';

import { StrictLayout } from 'Draw/layout/singleseq/strict/StrictLayout';
import layoutPartnersOfStrictDrawing from './layoutPartnersOfStrictDrawing';

let container = null;
let strictDrawing = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  strictDrawing = new StrictDrawing();
  strictDrawing.addTo(container, () => NodeSVG());
  strictDrawing.appendSequence('qwer', 'asdfQWERQWERQWER');
  strictDrawing.drawing.addSecondaryBond(
    strictDrawing.drawing.getBaseAtOverallPosition(3),
    strictDrawing.drawing.getBaseAtOverallPosition(7),
  );
  strictDrawing.drawing.addSecondaryBond(
    strictDrawing.drawing.getBaseAtOverallPosition(8),
    strictDrawing.drawing.getBaseAtOverallPosition(14),
  );
});

afterEach(() => {
  container.remove();
  container = null;

  strictDrawing = null;
});

it('handles error in creating layout', () => {
  strictDrawing.generalLayoutProps = () => { throw new Error() };
  expect(() => {
    new StrictLayout(
      layoutPartnersOfStrictDrawing(strictDrawing),
      strictDrawing.generalLayoutProps(),
      strictDrawing.perBaseLayoutProps(),
    );
  }).toThrow(); // layout cannot be created
  expect(() => updateLayout(strictDrawing)).not.toThrow();
});

describe('default behavior', () => {
  it('moves all bases', () => {
    let prevCoordinates = [];
    strictDrawing.drawing.forEachBase(b => prevCoordinates.push([b.xCenter, b.yCenter]));
    function expectAllBasesToHaveMoved() {
      strictDrawing.drawing.forEachBase((b, p) => {
        expect(b.xCenter).not.toBeCloseTo(prevCoordinates[p - 1][0]);
        expect(b.yCenter).not.toBeCloseTo(prevCoordinates[p - 1][1]);
      });
    }
    expect(() => expectAllBasesToHaveMoved()).toThrow();
    updateLayout(strictDrawing);
    expect(() => expectAllBasesToHaveMoved()).not.toThrow();
  });

  it('updates padding', () => {
    let prevWidth = strictDrawing.drawing.width;
    let prevHeight = strictDrawing.drawing.height;
    strictDrawing.baseWidth = 20 * strictDrawing.baseWidth;
    strictDrawing.baseHeight = 22 * StrictLayout.baseHeight;
    updateLayout(strictDrawing);
    expect(strictDrawing.drawing.width).not.toBeCloseTo(prevWidth);
    expect(strictDrawing.drawing.height).not.toBeCloseTo(prevHeight);
  });
});

it('only moving some bases', () => {
  let toBeMoved = new Set([4, 6, 8, 9, 10]);
  let prevCoordinates = [];
  strictDrawing.drawing.forEachBase(b => prevCoordinates.push([b.xCenter, b.yCenter]));
  function expectSpecifiedBasesToHaveMoved() {
    strictDrawing.drawing.forEachBase((b, p) => {
      if (toBeMoved.has(p)) {
        expect(b.xCenter).not.toBeCloseTo(prevCoordinates[p - 1][0]);
        expect(b.yCenter).not.toBeCloseTo(prevCoordinates[p - 1][1])
      }
    })
  }
  function expectUnspecifiedBasesNotToHaveMoved() {
    strictDrawing.drawing.forEachBase((b, p) => {
      if (!toBeMoved.has(p)) {
        expect(b.xCenter).toBeCloseTo(prevCoordinates[p - 1][0]);
        expect(b.yCenter).toBeCloseTo(prevCoordinates[p - 1][1]);
      }
    });
  }
  expect(() => expectSpecifiedBasesToHaveMoved()).toThrow();
  expect(() => expectUnspecifiedBasesNotToHaveMoved()).not.toThrow();
  updateLayout(strictDrawing, { onlyMove: toBeMoved });
  expect(() => expectSpecifiedBasesToHaveMoved()).not.toThrow();
  expect(() => expectUnspecifiedBasesNotToHaveMoved()).not.toThrow();
});

it('not updating padding', () => {
  let prevWidth = strictDrawing.drawing.width;
  let prevHeight = strictDrawing.drawing.height;
  // should guarantee changes in dimensions if padding were updated
  strictDrawing.baseWidth = 25 * strictDrawing.baseWidth;
  strictDrawing.baseHeight = 23 * StrictLayout.baseHeight;
  updateLayout(strictDrawing, { updatePadding: false });
  expect(strictDrawing.drawing.width).toBeCloseTo(prevWidth);
  expect(strictDrawing.drawing.height).toBeCloseTo(prevHeight);
});
