import { round } from 'Math/round';

export type Nullish = null | undefined;

export type Options = {

  // the number of decimal places to round the displayed number to
  places?: number;
};

/**
 * Converts the number to a string that can be displayed to the user.
 *
 * Returns an empty string if the number is nullish or NaN.
 */
export function numberToDisplayableString(n: number | Nullish, options?: Options): string {
  if (n == null) {
    return '';
  } else if (Number.isNaN(n)) {
    return '';
  }

  if (options?.places != undefined) {
    n = round(n, options.places);
  }

  return n.toString();
}
