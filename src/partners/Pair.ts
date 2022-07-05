/**
 * A pairing of two positions.
 */
export type Pair = [number, number];

/**
 * Returns the upstream partner of the pair.
 */
export function upstreamPartner(pair: Pair): number {
  return Math.min(...pair);
}

/**
 * Returns the downstream partner of the pair.
 */
export function downstreamPartner(pair: Pair): number {
  return Math.max(...pair);
}
