export type Pair = [number, number];

// returns the upstream partner of the pair
export function upstreamPartner(pr: Pair): number {
  return Math.min(...pr);
}

// returns the downstream partner of the pair
export function downstreamPartner(pr: Pair): number {
  return Math.max(...pr);
}
