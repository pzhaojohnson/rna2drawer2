/**
 * Converts the font weight value to its corresponding number value
 * (e.g., a font weight value of "bold" would correspond to 700).
 *
 * Converts number font weight values input as strings to numbers.
 *
 * Returns undefined if unable to convert the font weight value.
 *
 * Currently unable to convert font weight values of "bolder" and
 * "lighter".
 */
export function fontWeightValueToNumber(value: unknown): number | undefined {
  if (typeof value == 'number') {
    return value;
  }

  if (value == 'normal') {
    return 400;
  } else if (value == 'bold') {
    return 700;
  } else if (value == 'bolder') {
    return undefined;
  } else if (value == 'lighter') {
    return undefined;
  }

  if (typeof value == 'string') {
    let n = Number.parseFloat(value);
    if (Number.isFinite(n)) {
      return n;
    }
  }

  return undefined;
}
