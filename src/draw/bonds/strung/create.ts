import * as SVG from '@svgdotjs/svg.js';
import { assignUuid } from 'Draw/svg/assignUuid';

import type { StrungText } from 'Draw/bonds/strung/StrungElement';
import type { StrungCircle } from 'Draw/bonds/strung/StrungElement';
import type { StrungTriangle } from 'Draw/bonds/strung/StrungElement';
import type { StrungRectangle } from 'Draw/bonds/strung/StrungElement';

import { strungTextDefaultValues } from 'Draw/bonds/strung/defaults';
import { strungCircleDefaultValues } from 'Draw/bonds/strung/defaults';
import { strungTriangleDefaultValues } from 'Draw/bonds/strung/defaults';
import { strungRectangleDefaultValues } from 'Draw/bonds/strung/defaults';

import { repositionStrungElement } from 'Draw/bonds/strung/repositionStrungElement';
import type { BezierCurve } from 'Draw/bonds/strung/BezierCurve';

export type StrungElementOptions = {
  /**
   * The curve that the element is to be strung on.
   */
  curve: BezierCurve;
  curveLength: number;
};

export type StrungTextOptions = StrungElementOptions & {
  text: string;
};

export function createStrungText(options: StrungTextOptions): StrungText {
  let text: StrungText = {
    type: 'StrungText',
    text: new SVG.Text(),
    displacementFromCenter: 0,
    displacementFromCurve: { x: 0, y: 0 },
  };
  assignUuid(text.text);
  text.text.attr(strungTextDefaultValues.text);
  text.text.text(options.text);
  // reposition after setting the text content
  repositionStrungElement(text, {
    curve: options.curve,
    curveLength: options.curveLength,
  });
  return text;
}

export function createStrungCircle(options: StrungElementOptions): StrungCircle {
  let circle: StrungCircle = {
    type: 'StrungCircle',
    circle: new SVG.Circle(),
    displacementFromCenter: 0,
    displacementFromCurve: { x: 0, y: 0 },
  };
  assignUuid(circle.circle);
  circle.circle.attr(strungCircleDefaultValues.circle);
  repositionStrungElement(circle, {
    curve: options.curve,
    curveLength: options.curveLength,
  });
  return circle;
}

export function createStrungTriangle(options: StrungElementOptions): StrungTriangle {
  let triangle: StrungTriangle = {
    type: 'StrungTriangle',
    path: new SVG.Path(),
    width: strungTriangleDefaultValues.width,
    height: strungTriangleDefaultValues.height,
    tailsHeight: strungTriangleDefaultValues.tailsHeight,
    rotation: 0,
    displacementFromCenter: 0,
    displacementFromCurve: { x: 0, y: 0 },
  };
  assignUuid(triangle.path);
  triangle.path.attr(strungTriangleDefaultValues.path);
  repositionStrungElement(triangle, {
    curve: options.curve,
    curveLength: options.curveLength,
  });
  return triangle;
}

export function createStrungRectangle(options: StrungElementOptions): StrungRectangle {
  let rectangle: StrungRectangle = {
    type: 'StrungRectangle',
    path: new SVG.Path(),
    width: strungRectangleDefaultValues.width,
    height: strungRectangleDefaultValues.height,
    borderRadius: strungRectangleDefaultValues.borderRadius,
    rotation: 0,
    displacementFromCenter: 0,
    displacementFromCurve: { x: 0, y: 0 },
  };
  assignUuid(rectangle.path);
  rectangle.path.attr(strungRectangleDefaultValues.path);
  repositionStrungElement(rectangle, {
    curve: options.curve,
    curveLength: options.curveLength,
  });
  return rectangle;
}
