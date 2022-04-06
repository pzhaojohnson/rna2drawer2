import { isBlank } from 'Parse/isBlank';

/**
 * Parses the percentage string as a proportion.
 * (A percentage '%' sign does not have to be present at the end
 * of the percentage string.)
 *
 * Returns NaN if the percentage string is blank or a number cannot
 * be parsed from the percentage string.
 */
export function parsePercentageString(percentageString: string): number {
  if (isBlank(percentageString)) {
    return NaN;
  }

  let percentage = Number.parseFloat(percentageString);
  if (Number.isNaN(percentage)) {
    return NaN;
  }

  return percentage / 100;
}
