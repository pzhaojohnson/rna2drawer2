import { round } from 'Math/round';

export type Nullish = null | undefined;

export type Options = {

  // the number of decimal places to round the displayed percentage to
  // (due to floating point imprecision in converting a proportion to
  // a percentage, it is preferrable that this always be specified)
  places: number;
};

/**
 * Converts the proportion to a percentage string that can be displayed to the user.
 * (A percentage '%' sign is included at the end of the returned string.)
 *
 * Returns an empty string if the proportion is nullish or NaN.
 */
export function displayablePercentageString(proportion: number | Nullish, options: Options): string {
  if (proportion == null) {
    return '';
  } else if (Number.isNaN(proportion)) {
    return '';
  }

  let percentage = 100 * proportion;
  percentage = round(percentage, options.places);
  return percentage + '%';
}
