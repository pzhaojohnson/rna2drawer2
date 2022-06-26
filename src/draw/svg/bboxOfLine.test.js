import * as SVG from '@svgdotjs/svg.js';
import * as NodeSVG from 'Draw/svg/NodeSVG';

import { bboxOfLine } from './bboxOfLine';

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
  svg = null;

  container.remove();
  container = null;
});

describe('bboxOfLine function', () => {
  test('a line going from top-left to bottom-right', () => {
    let line = svg.line(20, 18, 28.66, 13);
    line.attr('stroke-width', 8);

    line.attr('stroke-linecap', 'butt'); // butt stroke-linecap
    let bbox = new SVG.Box(18, 9.5359, 12.6600, 11.9281);
    expect(boxesAreClose(bbox, bboxOfLine(line))).toBeTruthy();

    line.attr('stroke-linecap', 'square'); // square stroke-linecap
    bbox = new SVG.Box(14.5358, 7.5358, 19.5882, 15.9282);
    expect(boxesAreClose(bbox, bboxOfLine(line))).toBeTruthy();

    line.attr('stroke-linecap', 'round'); // round stroke-linecap
    bbox = new SVG.Box(16, 9, 16.6599, 13);
    expect(boxesAreClose(bbox, bboxOfLine(line))).toBeTruthy();
  });

  test('a line going from bottom-left to top-right', () => {
    let line = svg.line(-31, 1, -27, 32);
    line.attr('stroke-width', 5);

    line.attr('stroke-linecap', 'butt'); // butt stroke-linecap
    let bbox = new SVG.Box(-33.4794, 0.6800, 8.9588, 31.6398);
    expect(boxesAreClose(bbox, bboxOfLine(line))).toBeTruthy();

    line.attr('stroke-linecap', 'square'); // square stroke-linecap
    bbox = new SVG.Box(-33.7993, -1.7993, 9.5987, 36.5987);
    expect(boxesAreClose(bbox, bboxOfLine(line))).toBeTruthy();

    line.attr('stroke-linecap', 'round'); // round stroke-linecap
    bbox = new SVG.Box(-33.5, -1.5, 9, 36);
    expect(boxesAreClose(bbox, bboxOfLine(line))).toBeTruthy();
  });

  test('a stroke-width of zero', () => {
    let line = svg.line(50, 60, 75.5, 37.6);
    line.attr('stroke-width', 0);

    let bbox = new SVG.Box(50, 37.6, 25.5, 22.4);

    line.attr('stroke-linecap', 'butt'); // butt stroke-linecap
    expect(boxesAreClose(bbox, bboxOfLine(line))).toBeTruthy();
    line.attr('stroke-linecap', 'square'); // square stroke-linecap
    expect(boxesAreClose(bbox, bboxOfLine(line))).toBeTruthy();
    line.attr('stroke-linecap', 'round'); // round stroke-linecap
    expect(boxesAreClose(bbox, bboxOfLine(line))).toBeTruthy();
  });

  test('when points 1 and 2 are the same point', () => {
    let line = svg.line(20.3, 56, 20.3, 56);
    line.attr('stroke-width', 5);

    line.attr('stroke-linecap', 'butt'); // butt stroke-linecap
    let bbox = new SVG.Box(20.3, 53.5, 0, 5);
    expect(boxesAreClose(bbox, bboxOfLine(line))).toBeTruthy();

    line.attr('stroke-linecap', 'square'); // square stroke-linecap
    bbox = new SVG.Box(17.8, 53.5, 5, 5);
    expect(boxesAreClose(bbox, bboxOfLine(line))).toBeTruthy();

    line.attr('stroke-linecap', 'round'); // round stroke-linecap
    bbox = new SVG.Box(17.8, 53.5, 5, 5);
    expect(boxesAreClose(bbox, bboxOfLine(line))).toBeTruthy();
  });

  test('string attribute values', () => {
    let line = svg.line('5px', '10', '15.2', '20.3px');
    line.attr('stroke-width', '6px');
    let bbox = new SVG.Box(2.8683, 7.8890, 14.4632, 14.5218);
    expect(boxesAreClose(bbox, bboxOfLine(line))).toBeTruthy();
  });
});
