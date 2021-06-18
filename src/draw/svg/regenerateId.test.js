import { regenerateId } from './regenerateId';
import { NodeSVG } from 'Draw/NodeSVG';
import { SVGElementWrapper as ElementWrapper } from './element';
import { SVGTextWrapper as TextWrapper } from './text';
import { SVGLineWrapper as LineWrapper } from './line';
import { SVGCircleWrapper as CircleWrapper } from './circle';
import { SVGPathWrapper as PathWrapper } from './path';

let container = null;
let svg = null;
let elements = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  elements = [
    new ElementWrapper(svg.rect(20, 30)),
    new TextWrapper(svg.text('asdf')),
    new LineWrapper(svg.line(50, 20, 30, 2000)),
    new CircleWrapper(svg.circle(60)),
    new PathWrapper(svg.path('M 1 11 Q 22 33 44 55')),
  ];
});

afterEach(() => {
  elements = null;

  svg.clear();
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('regenerateId function', () => {
  // use the attr method to retrieve IDs in these tests
  // since the id method can also set and initialize IDs

  it('regenerates IDs', () => {
    elements.forEach(ele => {
      ele.id(); // initialize ID
      let prevId = ele.attr('id');
      expect(prevId).toBeTruthy();
      regenerateId(ele);
      let currId = ele.attr('id');
      expect(currId).toBeTruthy();
      expect(currId).not.toEqual(prevId);
    });
  });

  it('handles elements with undefined IDs', () => {
    elements.forEach(ele => {
      expect(ele.attr('id')).toBe(undefined);
      regenerateId(ele);
      expect(ele.attr('id')).toBeTruthy();
    });
  });
});
