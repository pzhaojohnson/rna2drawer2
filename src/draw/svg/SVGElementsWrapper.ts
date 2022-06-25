import * as SVG from '@svgdotjs/svg.js';
import { interpretNumber } from 'Draw/svg/interpretNumber';

import { ValuesWrapper } from 'Values/ValuesWrapper';
import { NumbersWrapper } from 'Values/NumbersWrapper';

export type Nullish = null | undefined;

export function isSVGNumber(v: unknown): v is SVG.Number {
  return v instanceof SVG.Number;
}

export type NumericAttributeOptions = {
  /**
   * The number of decimal places to round to when determining
   * the common value of a numeric attribute.
   */
  places?: number;
};

export class SVGElementsWrapper {
  readonly elements: SVG.Element[];

  constructor(elements: SVG.Element[]) {
    this.elements = elements;
  }

  /**
   * If all elements have the same value for the given attribute,
   * returns that value. Returns undefined otherwise.
   *
   * Returns undefined for an empty array of elements.
   */
  getAttribute(name: string): unknown | undefined {
    if (this.elements.length == 0) {
      return undefined;
    }

    let values = this.elements.map(ele => ele.attr(name));
    return (new ValuesWrapper(values)).commonValue;
  }

  /**
   * If all elements have the same numeric value (to the specified precision)
   * for the given attribute, that numeric value is returned as a number.
   * Otherwise, undefined or null is returned.
   *
   * Units such as pt and cm are ignored. (All lengths are interpreted to be in px.)
   * (Percentages are converted to proportions, though.)
   *
   * Returns undefined for an empty array of elements.
   */
  getNumericAttribute(name: string, options?: NumericAttributeOptions): number | Nullish {
    if (this.elements.length == 0) {
      return undefined;
    }

    let values = this.elements.map(ele => ele.attr(name));
    let interpretedValues = values.map(interpretNumber);
    let numbers = interpretedValues.filter(isSVGNumber).map(n => n.valueOf());

    if (numbers.length < values.length) {
      return undefined; // not all values could be interpreted
    }

    let wrappedNumbers = new NumbersWrapper(numbers);

    if (options?.places != undefined) {
      wrappedNumbers = wrappedNumbers.round(options.places);
    }

    return wrappedNumbers.commonValue;
  }
}
