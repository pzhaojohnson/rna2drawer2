export type Options = { places: number };

/**
 * Returns true if the two numbers are the same rounding to
 * the specified number of decimal places and false otherwise.
 *
 * Rounds to three decimal places if the number of decimal places
 * is not specified.
 */
export function areClose(n1: number, n2: number, options?: Options): boolean {
  let places = options?.places ?? 3;

  n1 = Number.parseFloat(n1.toFixed(places));
  n2 = Number.parseFloat(n2.toFixed(places));
  return n1 == n2;
}
