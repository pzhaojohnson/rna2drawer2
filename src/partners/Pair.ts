/**
 * A pairing of two positions.
 */
export type Pair = [number, number];

/**
 * Returns the upstream partner of the pair.
 */
export function upstreamPartner(pr: Pair): number {
  return Math.min(...pr);
}

/**
 * Returns the downstream partner of the pair.
 */
export function downstreamPartner(pr: Pair): number {
  return Math.max(...pr);
}
