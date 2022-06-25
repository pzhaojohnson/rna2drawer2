import { ValuesWrapper } from 'Values/ValuesWrapper';
import { NumbersWrapper } from 'Values/NumbersWrapper';

export type Nullish = null | undefined;

export function isNumber(v: unknown): v is number {
  return typeof v == 'number';
}

export type NumberPropertyOptions = {
  /**
   * The number of decimal places to round to when determining
   * the common value of a number property.
   */
  places?: number;
};

export class ObjectsWrapper {
  readonly objects: { [key: string]: unknown }[];

  constructor(objects: object[]) {
    this.objects = objects as { [key: string]: unknown }[];
  }

  /**
   * If all objects have the same value assigned to the given property,
   * returns that value. Returns undefined otherwise.
   *
   * Returns undefined for an empty array of objects.
   */
  getProperty(name: string): unknown | undefined {
    if (this.objects.length == 0) {
      return undefined;
    }

    let values = this.objects.map(o => o[name]);
    return (new ValuesWrapper(values)).commonValue;
  }

  /**
   * If all objects have the same number (to the specified precision)
   * assigned to the given property, that number is returned.
   * Otherwise, undefined or null is returned.
   *
   * Returns undefined for an empty array of objects or if any objects
   * do not have a number assigned to the given property.
   */
  getNumberProperty(name: string, options?: NumberPropertyOptions): number | Nullish {
    if (this.objects.length == 0) {
      return undefined;
    }

    let values = this.objects.map(o => o[name]);
    let numbers = values.filter(isNumber);

    if (numbers.length < values.length) {
      return undefined; // not all values are numbers
    }

    let wrappedNumbers = new NumbersWrapper(numbers);

    if (options?.places != undefined) {
      wrappedNumbers = wrappedNumbers.round(options.places);
    }

    return wrappedNumbers.commonValue;
  }
}
