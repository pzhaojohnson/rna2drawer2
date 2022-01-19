import { Drawing } from 'Draw/Drawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';

import { DrawingOverlay } from './DrawingOverlay';

let container = null;
let drawing = null;
let drawingOverlay = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  drawing = new Drawing({ SVG: { SVG: NodeSVG } });
  drawing.appendTo(container);

  drawingOverlay = new DrawingOverlay({ SVG: { SVG: NodeSVG } });
});

afterEach(() => {
  drawingOverlay = null;
  drawing = null;

  container.remove();
  container = null;
});

describe('DrawingOverlay class', () => {
  it('is absolutely positioned by default', () => {
    expect(drawingOverlay.svg.node.style.position).toBe('fixed');
  });

  it('ignores pointer events by default', () => {
    expect(drawingOverlay.svg.node.style.pointerEvents).toBe('none');
  });

  test('clear method', () => {
    drawingOverlay.svg.circle(20);
    drawingOverlay.svg.rect(50, 40);
    expect(drawingOverlay.svg.children().length).toBeGreaterThan(0);
    drawingOverlay.clear();
    expect(drawingOverlay.svg.children().length).toBe(0); // cleared the SVG document
  });

  /**
   * Would like to test placeOver, placeUnder and fitTo methods as well,
   * but seem tricky to test on Node.js.
   */
});
