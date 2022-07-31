// has side effects necessary for some tests to work on Node.js
import { NodeSVG } from 'Draw/svg/NodeSVG';

import { uuidRegex } from 'Draw/svg/assignUuid';

import { repositionStrungElement } from 'Draw/bonds/strung/repositionStrungElement';

import { createStrungText } from './create';
import { createStrungCircle } from './create';
import { createStrungTriangle } from './create';
import { createStrungRectangle } from './create';

test('createStrungText function', () => {
  let curve = { startPoint: { x: 5, y: 8 }, endPoint: { x: 9, y: 11 } };
  let curveLength = 5;
  let text = createStrungText({ text: 'B', curve, curveLength });
  expect(text.text.id()).toMatch(uuidRegex); // assigned a UUID
  expect(text.text.text()).toBe('B'); // created with specified text
  let center1 = { x: text.text.cx(), y: text.text.cy() };
  repositionStrungElement(text, { curve, curveLength });
  let center2 = { x: text.text.cx(), y: text.text.cy() };
  // had repositioned the strung text
  expect(center1.x).toBeCloseTo(center2.x);
  expect(center1.y).toBeCloseTo(center2.y);
});

test('createStrungCircle function', () => {
  let curve = { startPoint: { x: 2, y: 3 }, endPoint: { x: 2, y: 22 } };
  let curveLength = 19;
  let circle = createStrungCircle({ curve, curveLength });
  expect(circle.circle.id()).toMatch(uuidRegex); // assigned a UUID
  let center1 = { x: circle.circle.cx(), y: circle.circle.cy() };
  repositionStrungElement(circle, { curve, curveLength });
  let center2 = { x: circle.circle.cx(), y: circle.circle.cy() };
  // had repositioned the strung circle
  expect(center1.x).toBeCloseTo(center2.x);
  expect(center1.y).toBeCloseTo(center2.y);
});

test('createStrungTriangle function', () => {
  let curve = { startPoint: { x: -12, y: -4 }, endPoint: { x: -12, y: 9 } };
  let curveLength = 13;
  let triangle = createStrungTriangle({ curve, curveLength });
  expect(triangle.path.id()).toMatch(uuidRegex); // assigned a UUID
  let d1 = triangle.path.attr('d');
  repositionStrungElement(triangle, { curve, curveLength });
  let d2 = triangle.path.attr('d');
  // had repositioned the strung triangle
  expect(d1).toBe(d2);
});

test('createStrungRectangle function', () => {
  let curve = { startPoint: { x: -20, y: -18 }, endPoint: { x: -8, y: -23 } };
  let curveLength = 13;
  let rectangle = createStrungRectangle({ curve, curveLength });
  expect(rectangle.path.id()).toMatch(uuidRegex); // assigned a UUID
  let d1 = rectangle.path.attr('d');
  repositionStrungElement(rectangle, { curve, curveLength });
  let d2 = rectangle.path.attr('d');
  // had repositioned the strung rectangle
  expect(d1).toBe(d2);
});
