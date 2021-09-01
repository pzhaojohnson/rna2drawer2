import { shift } from './shift';
import { NodeSVG } from 'Draw/svg/NodeSVG';

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

test('shift function', () => {
  // should handle elements of all types
  let eles = [
    svg.plain('G'),
    svg.line(40, 20, 600, 30),
    svg.circle(60),
    svg.rect(50, 500),
    svg.path('M 20 30 Q 50 55.5 1000 233'),
  ];
  let centers = [];
  eles.forEach(ele => {
    let c = { x: 400 * Math.random(), y: 600 * Math.random() };
    ele.center(c.x, c.y);
    centers.push(c);
  });
  let s = {
    x: (200 * Math.random()) - 100,
    y: (300 * Math.random()) - 150,
  };
  shift(eles, s);
  eles.forEach((ele, i) => {
    expect(ele.cx()).toBeCloseTo(centers[i].x + s.x);
    expect(ele.cy()).toBeCloseTo(centers[i].y + s.y);
  });
});
