import {
  removeOutline,
  removeHighlighting,
} from './add';
import { NodeSVG } from 'Draw/NodeSVG';
import Base from 'Draw/Base';

function wasRemoved(ele) {
  return ele.root() ? false : true;
}

let container = null;
let svg = null;
let base = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  base = Base.create(svg, 'A', 50, 200);
});

afterEach(() => {
  base = null;

  svg.clear();
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('removeOutline function', () => {
  it('removes circle and reference', () => {
    base.addCircleOutline();
    let c = base.outline.circle;
    expect(wasRemoved(c)).toBeFalsy();
    removeOutline(base);
    expect(wasRemoved(c)).toBeTruthy(); // removed circle
    expect(base.outline).toBe(undefined); // removed reference
  });

  it('handles a base with no outline', () => {
    expect(base.outline).toBe(undefined);
    expect(
      () => removeOutline(base)
    ).not.toThrow();
  });
});

describe('removeHighlighting function', () => {
  it('removes circle and reference', () => {
    base.addCircleHighlighting();
    let c = base.highlighting.circle;
    expect(wasRemoved(c)).toBeFalsy();
    removeHighlighting(base);
    expect(wasRemoved(c)).toBeTruthy(); // removed circle
    expect(base.highlighting).toBe(undefined); // removed reference
  });

  it('handles a base with no highlighting', () => {
    expect(base.highlighting).toBe(undefined);
    expect(
      () => removeHighlighting(base)
    ).not.toThrow();
  });
});
