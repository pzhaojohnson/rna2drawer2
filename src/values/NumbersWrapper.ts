import { ValuesWrapper } from 'Values/ValuesWrapper';
import { round } from 'Math/round';

export type Nullish = null | undefined;

export function isNumber(v: unknown): v is number {
  return typeof v == 'number';
}

export class NumbersWrapper {
  readonly values: (number | Nullish)[];

  constructor(values: (number | Nullish)[]) {
    this.values = values;
  }

  /**
   * If all values are the same value, returns that value.
   * Returns undefined otherwise.
   *
   * Returns undefined for an empty array of values.
   */
  get commonValue(): number | Nullish {
    let values = new ValuesWrapper(this.values);
    return values.commonValue;
  }

  /**
   * Returns the minimum number in the array of values.
   *
   * Ignores nullish values and returns undefined
   * if there are no numbers in the array of values.
   */
  get min(): number | undefined {
    let values = this.values.filter(isNumber);

    if (values.length == 0) {
      return undefined;
    } else {
      return Math.min(...values);
    }
  }

  /**
   * Returns the maximum number in the array of values.
   *
   * Ignores nullish values and returns undefined
   * if there are no numbers in the array of values.
   */
  get max(): number | undefined {
    let values = this.values.filter(isNumber);

    if (values.length == 0) {
      return undefined;
    } else {
      return Math.max(...values);
    }
  }

  /**
   * Rounds numbers in the array of values to the specified decimal places.
   *
   * Nullish values are left alone (i.e., maintained) in the array of values.
   */
  round(places=0): NumbersWrapper {
    let roundedValues = (
      this.values.map(
        v => isNumber(v) ? round(v, places) : v
      )
    );

    return new NumbersWrapper(roundedValues);
  }
}
