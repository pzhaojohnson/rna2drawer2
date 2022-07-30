import { NodeSVG } from 'Draw/svg/NodeSVG';

import { createStrungText } from 'Draw/bonds/strung/create';
import { createStrungCircle } from 'Draw/bonds/strung/create';
import { createStrungTriangle } from 'Draw/bonds/strung/create';
import { createStrungRectangle } from 'Draw/bonds/strung/create';

import { appendStrungElement } from './add';
import { removeStrungElement } from './add';

let container = null;
let svg = null;

let curve = null;
let curveLength = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  // add some elements so that can check that strung elements are being
  // appended to the end of the SVG document
  svg.circle(10);
  svg.rect(10, 20);
  svg.text('A');
  svg.path('M 0 0 L 5 5');
  svg.circle(5);

  curve = { startPoint: { x: 8, y: -9 }, endPoint: { x: 5, y: -13 } };
  curveLength = 5;
});

afterEach(() => {
  curve = null;
  curveLength = null;

  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('appendStrungElement and removeStrungElement functions', () => {
  test('a strung text', () => {
    let text = createStrungText({ text: 'W', curve, curveLength });
    expect(text.text.root()).toBe(null);

    appendStrungElement(svg, text);
    expect(text.text.root()).toBe(svg); // was added

    // was appended to the end of the SVG document
    expect(text.text.position()).toBe(svg.children().length - 1);
    expect(svg.children().length).toBeGreaterThan(2);

    removeStrungElement(text);
    expect(text.text.root()).toBe(null); // was removed
  });

  test('a strung circle', () => {
    let circle = createStrungCircle({ curve, curveLength });
    expect(circle.circle.root()).toBe(null);

    appendStrungElement(svg, circle);
    expect(circle.circle.root()).toBe(svg); // was added

    // was appended to the end of the SVG document
    expect(circle.circle.position()).toBe(svg.children().length - 1);
    expect(svg.children().length).toBeGreaterThan(2);

    removeStrungElement(circle);
    expect(circle.circle.root()).toBe(null); // was removed
  });

  test('a strung triangle', () => {
    let triangle = createStrungTriangle({ curve, curveLength });
    expect(triangle.path.root()).toBe(null);

    appendStrungElement(svg, triangle);
    expect(triangle.path.root()).toBe(svg); // was added

    // was appended to the end of the SVG document
    expect(triangle.path.position()).toBe(svg.children().length - 1);
    expect(svg.children().length).toBeGreaterThan(2);

    removeStrungElement(triangle);
    expect(triangle.path.root()).toBe(null); // was removed
  });

  test('a strung rectangle', () => {
    let rectangle = createStrungRectangle({ curve, curveLength });
    expect(rectangle.path.root()).toBe(null);

    appendStrungElement(svg, rectangle);
    expect(rectangle.path.root()).toBe(svg); // was added

    // was appended to the end of the SVG document
    expect(rectangle.path.position()).toBe(svg.children().length - 1);
    expect(svg.children().length).toBeGreaterThan(2);

    removeStrungElement(rectangle);
    expect(rectangle.path.root()).toBe(null); // was removed
  });
});
