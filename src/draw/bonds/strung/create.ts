import * as SVG from '@svgdotjs/svg.js';

import type { StrungText } from 'Draw/bonds/strung/StrungElement';
import type { StrungCircle } from 'Draw/bonds/strung/StrungElement';
import type { StrungTriangle } from 'Draw/bonds/strung/StrungElement';
import type { StrungRectangle } from 'Draw/bonds/strung/StrungElement';

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
    width: 9,
    height: 9,
    tailsHeight: 0,
    rotation: 0,
    displacementFromCenter: 0,
    displacementFromCurve: { x: 0, y: 0 },
  };
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
    width: 9,
    height: 9,
    borderRadius: 0,
    rotation: 0,
    displacementFromCenter: 0,
    displacementFromCurve: { x: 0, y: 0 },
  };
  repositionStrungElement(rectangle, {
    curve: options.curve,
    curveLength: options.curveLength,
  });
  return rectangle;
}
