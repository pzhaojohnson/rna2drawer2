import * as SVG from '@svgdotjs/svg.js';

export const strokeLinecapValues = ['butt', 'round', 'square'] as const;
export type StrokeLinecapValue = typeof strokeLinecapValues[number];

export function isStrokeLinecapValue(v: unknown): v is StrokeLinecapValue {
  return strokeLinecapValues.includes(v as any);
}

/**
 * Returns the stroke-linecap of the elements and undefined
 * for an empty array of elements or if the elements do not
 * all have the same stroke-linecap.
 */
export function strokeLinecap(eles: SVG.Element[]): unknown | undefined {
  if (eles.length == 0) {
    return undefined;
  }

  let values = new Set<unknown>(
    eles.map(ele => ele.attr('stroke-linecap'))
  );

  if (values.size == 1) {
    return values.values().next().value;
  } else {
    return undefined;
  }
}

/**
 * Sets the stroke-linecap of each element to the given value.
 * (Does nothing if the given value is not a valid stroke-linecap
 * value.)
 */
export function setStrokeLinecap(eles: SVG.Element[], value: unknown) {
  if (!isStrokeLinecapValue(value)) {
    return;
  }

  eles.forEach(ele => ele.attr('stroke-linecap', value));
}
