/**
 * It is undefined what is returned for an empty list of numbers.
 */
export function areAllSameNumber(ns: number[]): boolean {
  let uniques = new Set<number>();
  ns.forEach(n => {
    uniques.add(n);
  });
  return uniques.size == 1;
}
