import highlightBase from './highlightBase';
import NodeSVG from '../../NodeSVG';
import Base from '../../Base';

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
    fill: 'crimson',
    fillOpacity: 0.08,
  };
  let h = highlightBase(b, hps);
  Object.keys(hps).forEach(prop => {
    expect(h[prop]).toBe(hps[prop]);
  });
});

it('base already has highlighting', () => {
  let b = Base.create(svg, 'g', 10, 10);
  let h = b.addCircleHighlighting();
  h.fill = '#aabb11';
  h.strokeOpacity = 0.34;
  let returned = highlightBase(b, { radius: 5.02, fill: '#1199ba' });
  expect(returned).toBe(h); // does not remove preexisting highlighting
  expect(h.strokeOpacity).toBe(0.34); // maintains
  expect(h.fill).toBe('#1199ba'); // overwrites
  expect(h.radius).toBeCloseTo(5.02); // sets
});
