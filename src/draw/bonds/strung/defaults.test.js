import { NodeSVG } from 'Draw/svg/NodeSVG';

import { createStrungText } from 'Draw/bonds/strung/create';
import { createStrungCircle } from 'Draw/bonds/strung/create';
import { createStrungTriangle } from 'Draw/bonds/strung/create';
import { createStrungRectangle } from 'Draw/bonds/strung/create';

import { appendStrungElement } from 'Draw/bonds/strung/add';

import { strungTextDefaultValues } from './defaults';
import { strungCircleDefaultValues } from './defaults';
import { strungTriangleDefaultValues } from './defaults';
import { strungRectangleDefaultValues } from './defaults';

import { updateDefaultValues } from './defaults';

let container = null;
let svg = null;

let curve = null;
let curveLength = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  curve = { startPoint: { x: -2, y: -6 }, endPoint: { x: -14, y: -1 } };
  curveLength = 13;
});

afterEach(() => {
  curve = null;
  curveLength = null;

  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('updateDefaultValues function', () => {
  test('a strung text', () => {
    let text = createStrungText({ text: 'W', curve, curveLength });
    appendStrungElement(svg, text);
    text.text.attr({
      'font-family': 'Consolas',
      'font-size': 18.6,
      'font-weight': 550,
      'fill': '#123bc8',
      'fill-opacity': 0.28,
    });

    updateDefaultValues(text);
    expect(strungTextDefaultValues).toStrictEqual({
      text: {
        'font-family': 'Consolas',
        'font-size': 18.6,
        'font-weight': 550,
        'fill': '#123bc8',
        'fill-opacity': 0.28,
      },
    });

    // test nullish SVG element attributes
    text.text.attr({
      'font-family': null,
      'font-size': null,
      'font-weight': null,
      'fill': null,
      'fill-opacity': null,
    });

    updateDefaultValues(text);
    expect(strungTextDefaultValues).toStrictEqual({
      text: {
        'font-family': 'Consolas', // unchanged
        'font-size': 18.6, // unchanged
        'font-weight': 550, // unchanged
        'fill': '#000000', // built-in default value
        'fill-opacity': 1, // built-in default value
      },
    });
  });

  test('a strung circle', () => {
    let circle = createStrungCircle({ curve, curveLength });
    appendStrungElement(svg, circle);
    circle.circle.attr({
      'r': 19.2,
      'stroke': '#bb446a',
      'stroke-width': 3.82,
      'stroke-opacity': 0.81,
      'fill': '#abcdd5',
      'fill-opacity': 0.22,
    });

    updateDefaultValues(circle);
    expect(strungCircleDefaultValues).toStrictEqual({
      circle: {
        'r': 19.2,
        'stroke': '#bb446a',
        'stroke-width': 3.82,
        'stroke-opacity': 0.81,
        'fill': '#abcdd5',
        'fill-opacity': 0.22,
      },
    });

    // test nullish SVG element attributes
    circle.circle.attr({
      'r': null,
      'stroke': null,
      'stroke-width': null,
      'stroke-opacity': null,
      'fill': null,
      'fill-opacity': null,
    });

    updateDefaultValues(circle);
    expect(strungCircleDefaultValues).toStrictEqual({
      circle: {
        'r': 0, // built-in default value
        'stroke': '#000000', // built-in default value
        'stroke-width': 0, // built-in default value
        'stroke-opacity': 1, // built-in default value
        'fill': '#000000', // built-in default value
        'fill-opacity': 1, // built-in default value
      },
    });
  });

  test('a strung triangle', () => {
    let triangle = createStrungTriangle({ curve, curveLength });
    appendStrungElement(svg, triangle);
    triangle.path.attr({
      'stroke': '#ff497c',
      'stroke-width': 3.09,
      'stroke-opacity': 0.92,
      'fill': '#9835ab',
      'fill-opacity': 0.18,
    });
    triangle.width = 12.87;
    triangle.height = 22.08;
    triangle.tailsHeight = 0.85;

    updateDefaultValues(triangle);
    expect(strungTriangleDefaultValues).toStrictEqual({
      path: {
        'stroke': '#ff497c',
        'stroke-width': 3.09,
        'stroke-opacity': 0.92,
        'fill': '#9835ab',
        'fill-opacity': 0.18,
      },
      width: 12.87,
      height: 22.08,
      tailsHeight: 0.85,
    });

    // test nullish SVG element attributes
    triangle.path.attr({
      'stroke': null,
      'stroke-width': null,
      'stroke-opacity': null,
      'fill': null,
      'fill-opacity': null,
    });

    updateDefaultValues(triangle);
    expect(strungTriangleDefaultValues).toStrictEqual({
      path: {
        'stroke': '#000000', // built-in default value
        'stroke-width': 0, // built-in default value
        'stroke-opacity': 1, // built-in default value
        'fill': '#000000', // built-in default value
        'fill-opacity': 1, // built-in default value
      },
      width: 12.87,
      height: 22.08,
      tailsHeight: 0.85,
    });
  });

  test('a strung rectangle', () => {
    let rectangle = createStrungRectangle({ curve, curveLength });
    appendStrungElement(svg, rectangle);
    rectangle.path.attr({
      'stroke': '#ff321b',
      'stroke-width': 2.79,
      'stroke-opacity': 0.52,
      'fill': '#ab5622',
      'fill-opacity': 0.68,
    });
    rectangle.width = 14.08;
    rectangle.height = 12.11;
    rectangle.borderRadius = 1.67;

    updateDefaultValues(rectangle);
    expect(strungRectangleDefaultValues).toStrictEqual({
      path: {
        'stroke': '#ff321b',
        'stroke-width': 2.79,
        'stroke-opacity': 0.52,
        'fill': '#ab5622',
        'fill-opacity': 0.68,
      },
      width: 14.08,
      height: 12.11,
      borderRadius: 1.67,
    });

    // test nullish SVG element attributes
    rectangle.path.attr({
      'stroke': null,
      'stroke-width': null,
      'stroke-opacity': null,
      'fill': null,
      'fill-opacity': null,
    });

    updateDefaultValues(rectangle);
    expect(strungRectangleDefaultValues).toStrictEqual({
      path: {
        'stroke': '#000000', // built-in default value
        'stroke-width': 0, // built-in default value
        'stroke-opacity': 1, // built-in default value
        'fill': '#000000', // built-in default value
        'fill-opacity': 1, // built-in default value
      },
      width: 14.08,
      height: 12.11,
      borderRadius: 1.67,
    });
  });
});
