export type Pair = [number, number];

// returns the 5' partner of the pair
export function partner5(pr: Pair): number {
  return Math.min(...pr);
}

// returns the 3' partner of the pair
export function partner3(pr: Pair): number {
  return Math.max(...pr);
}

export {
  partner5 as upstreamPartner,
  partner3 as downstreamPartner,
};
