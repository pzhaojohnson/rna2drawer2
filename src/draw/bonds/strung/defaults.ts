import * as SVG from '@svgdotjs/svg.js';

import type { StrungElement } from 'Draw/bonds/strung/StrungElement';

import { isNullish } from 'Utilities/isNullish';

/**
 * Meant to be able to be directly input to the attr method of SVG elements.
 */
export type SVGElementAttributes = { [attributeName: string]: unknown };

export type StrungTextDefaultValues = {
  text: SVGElementAttributes;
};

export const strungTextDefaultValues: StrungTextDefaultValues = {
  text: {
    'font-family': 'Arial',
    'font-size': 8,
    'font-weight': 400,
    'fill': '#808080',
    'fill-opacity': 1,
  },
};

export type StrungCircleDefaultValues = {
  circle: SVGElementAttributes;
};

export const strungCircleDefaultValues: StrungCircleDefaultValues = {
  circle: {
    'r': 9,
    'stroke': '#000000',
    'stroke-width': 1,
    'stroke-opacity': 1,
    'fill': '#000000',
    'fill-opacity': 1,
  },
};

export type StrungTriangleDefaultValues = {
  path: SVGElementAttributes;
  width: number;
  height: number;
  tailsHeight: number;
};

export const strungTriangleDefaultValues: StrungTriangleDefaultValues = {
  path: {
    'stroke': '#000000',
    'stroke-width': 1,
    'stroke-opacity': 1,
    'fill': '#000000',
    'fill-opacity': 1,
  },
  width: 9,
  height: 9,
  tailsHeight: 0,
};

export type StrungRectangleDefaultValues = {
  path: SVGElementAttributes;
  width: number;
  height: number;
  borderRadius: number;
};

export const strungRectangleDefaultValues: StrungRectangleDefaultValues = {
  path: {
    'stroke': '#000000',
    'stroke-width': 1,
    'stroke-opacity': 1,
    'fill': '#000000',
    'fill-opacity': 1,
  },
  width: 9,
  height: 9,
  borderRadius: 0,
};

/**
 * Sets the default values for the type of provided strung element to the
 * values of the provided strung element.
 *
 * Ignores any nullish SVG element attributes that the provided strung element
 * has.
 */
export function updateDefaultValues(ele: StrungElement) {
  let svgElement: SVG.Element;
  if (ele.type == 'StrungText') {
    svgElement = ele.text;
  } else if (ele.type == 'StrungCircle') {
    svgElement = ele.circle;
  } else {
    svgElement = ele.path;
  }

  let defaultSVGElementAttributes: SVGElementAttributes;
  if (ele.type == 'StrungText') {
    defaultSVGElementAttributes = strungTextDefaultValues.text;
  } else if (ele.type == 'StrungCircle') {
    defaultSVGElementAttributes = strungCircleDefaultValues.circle;
  } else if (ele.type == 'StrungTriangle') {
    defaultSVGElementAttributes = strungTriangleDefaultValues.path;
  } else {
    defaultSVGElementAttributes = strungRectangleDefaultValues.path;
  }

  Object.keys(defaultSVGElementAttributes).forEach((name: string) => {
    let value: unknown = svgElement.attr(name);
    if (!isNullish(value)) {
      defaultSVGElementAttributes[name] = value;
    }
  });

  if (ele.type == 'StrungTriangle') {
    let defaultValues = strungTriangleDefaultValues;
    defaultValues.width = ele.width;
    defaultValues.height = ele.height;
    defaultValues.tailsHeight = ele.tailsHeight;
  }

  if (ele.type == 'StrungRectangle') {
    let defaultValues = strungRectangleDefaultValues;
    defaultValues.width = ele.width;
    defaultValues.height = ele.height;
    defaultValues.borderRadius = ele.borderRadius;
  }
}
