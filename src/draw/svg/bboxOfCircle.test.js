import * as SVG from '@svgdotjs/svg.js';
import * as NodeSVG from 'Draw/svg/NodeSVG';

import { bboxOfCircle } from './bboxOfCircle';

function boxesAreClose(box1, box2) {
  return (
    Math.abs(box1.x - box2.x) < 0.005
    && Math.abs(box1.y - box2.y) < 0.005
    && Math.abs(box1.width - box2.width) < 0.005
    && Math.abs(box1.height - box2.height) < 0.005
  );
}

let container = null;
let svg = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG.SVG();
  svg.addTo(container);
});

afterEach(() => {
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('bboxOfCircle function', () => {
  test('nonzero radius and stroke-width', () => {
    let circle = svg.circle(25);
    circle.attr({ 'cx': 23, 'cy': 36, 'stroke-width': 3 });
    let bbox = new SVG.Box(9, 22, 28, 28);
    expect(boxesAreClose(bbox, bboxOfCircle(circle))).toBeTruthy();
  });

  test('radius of zero', () => {
    let circle = svg.circle(0);
    circle.attr({ 'cx': 10, 'cy': 5, 'stroke-width': 2 });
    let bbox = new SVG.Box(9, 4, 2, 2);
    expect(boxesAreClose(bbox, bboxOfCircle(circle))).toBeTruthy();
  });

  test('stroke-width of zero', () => {
    let circle = svg.circle(50);
    circle.attr({ 'cx': 3, 'cy': 55, 'stroke-width': 0 });
    let bbox = new SVG.Box(-22, 30, 50, 50);
    expect(boxesAreClose(bbox, bboxOfCircle(circle))).toBeTruthy();
  });

  test('radius and stroke-width of zero', () => {
    let circle = svg.circle(0);
    circle.attr({ 'cx': 35, 'cy': 25, 'stroke-width': 0 });
    let bbox = new SVG.Box(35, 25, 0, 0);
    expect(boxesAreClose(bbox, bboxOfCircle(circle))).toBeTruthy();
  });

  test('string attribute values', () => {
    let circle = svg.circle('23px');
    circle.attr({ 'cx': '62', 'cy': '10.5px', 'stroke-width': '4.3px' });
    let bbox = new SVG.Box(48.35, -3.15, 27.3, 27.3);
    expect(boxesAreClose(bbox, bboxOfCircle(circle))).toBeTruthy();
  });
});
