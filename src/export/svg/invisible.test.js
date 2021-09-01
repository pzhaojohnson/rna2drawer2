import { removeInvisibleLines } from './invisible';
import { NodeSVG } from 'Draw/svg/NodeSVG';

function wasRemoved(ele) {
  return ele.root() ? false : true;
}

let container = null;
let svg = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);
});

afterEach(() => {
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

test('removeInvisibleLines function', () => {
  let line1 = svg.line(1, 2, 3, 4);
  let line2 = svg.line(2, 3, 4, 5);
  let line3 = svg.line(3, 4, 5, 6);
  let rect = svg.rect(50, 60);
  line1.attr({ 'opacity': 0.33, 'stroke-opacity': 0.9 });
  line2.attr({ 'opacity': 0, 'stroke-opacity': 0.8 });
  line3.attr({ 'opacity': 0.25, 'stroke-opacity': 0 });
  rect.attr({ 'opacity': 0, 'stroke-opacity': 0 });
  removeInvisibleLines(svg);
  expect(wasRemoved(line1)).toBeFalsy();
  expect(wasRemoved(line2)).toBeTruthy();
  expect(wasRemoved(line3)).toBeTruthy();
  expect(wasRemoved(rect)).toBeFalsy(); // ignores non-lines
});
