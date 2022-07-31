import * as SVG from '@svgdotjs/svg.js';

import type { StrungElement } from 'Draw/bonds/strung/StrungElement';

import { fromSpecification } from 'Draw/bonds/strung/save/fromSpecification';

export type Args = {
  /**
   * The SVG document that the specified strung elements are in.
   */
  svg: SVG.Svg;

  /**
   * Supposed to be an array of strung element specifications, though this
   * function is written to be able to handle any value passed in.
   */
  specifications: unknown;
};

/**
 * May throw if unable to create a strung element from its specification.
 */
export function fromSpecifications(args: Args): StrungElement[] | never {
  let svg = args.svg;

  if (!Array.isArray(args.specifications)) {
    return [];
  }

  let eles: StrungElement[] = [];
  args.specifications.forEach((value: unknown) => {
    if (typeof value == 'object' && value !== null) {
      let specification: {} = value;
      eles.push(fromSpecification({ svg, specification }));
    }
  });
  return eles;
}
