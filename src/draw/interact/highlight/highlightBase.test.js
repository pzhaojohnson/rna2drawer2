import highlightBase from './highlightBase';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { Base } from 'Draw/bases/Base';
import { addCircleHighlighting } from 'Draw/bases/annotate/circle/add';

let svg = NodeSVG();

it('missing props argument', () => {
  let b = Base.create(svg, 'a', 1, 2);
  let h = highlightBase(b);
  expect(h).toBeTruthy();
});

it('empty props argument', () => {
  let b = Base.create(svg, 'q', 5, 10);
  let h = highlightBase(b, {});
  expect(h).toBeTruthy();
});

it('highlights with given props', () => {
  let b = Base.create(svg, 'b', 20, 10);
  let hps = {
    radius: 5.67,
    stroke: 'cyan',
    strokeWidth: 8.12,
    strokeOpacity: 0.87,
    strokeDasharray: '8,8,2',
    fill: 'crimson',
    fillOpacity: 0.08,
  };
  let h = highlightBase(b, hps);
  expect(h.circle.attr('r')).toBeCloseTo(5.67);
  expect(h.circle.attr('stroke')).toBe('cyan');
  expect(h.circle.attr('stroke-width')).toBe(8.12);
  expect(h.circle.attr('stroke-opacity')).toBe(0.87);
  expect(h.circle.attr('stroke-dasharray')).toBe('8,8,2');
  expect(h.circle.attr('fill')).toBe('crimson');
  expect(h.circle.attr('fill-opacity')).toBe(0.08);
});

it('base already has highlighting', () => {
  let b = Base.create(svg, 'g', 10, 10);
  addCircleHighlighting(b);
  let h = b.highlighting;
  h.fill = '#aabb11';
  h.strokeOpacity = 0.34;
  let returned = highlightBase(b, { radius: 5.02, fill: '#1199ba' });
  expect(returned).toBe(h); // does not remove preexisting highlighting
  expect(h.strokeOpacity).toBe(0.34); // maintains
  expect(h.circle.attr('fill')).toBe('#1199ba'); // overwrites
  expect(h.circle.attr('r')).toBeCloseTo(5.02); // sets
});
