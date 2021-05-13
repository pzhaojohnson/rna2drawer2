export type Pair = [number, number];

// returns the 5' partner of the pair
export function partner5(pair: Pair): number {
  return Math.min(...pair);
}

// returns the 3' partner of the pair
export function partner3(pair: Pair): number {
  return Math.max(...pair);
}
