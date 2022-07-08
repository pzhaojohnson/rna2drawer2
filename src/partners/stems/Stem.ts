import type { Pair } from 'Partners/pairs/Pair';
import { PairWrapper } from 'Partners/pairs/PairWrapper';

/**
 * A consecutive stack of pairs.
 */
export type Stem = {
  /**
   * The 5' most position of the stem.
   */
  position5: number;

  /**
   * The 3' most position of the stem.
   */
  position3: number;

  /**
   * The number of pairs in the stem.
   */
  size: number;
};

export type StemSpecification = (
  { bottomPair: Pair, size: number }
  | { bottomPair: Pair, numPairs: number }
);

/**
 * Allows for stem objects to be specified in different ways
 * without knowledge of the underlying object structure.
 */
export function createStem(spec: StemSpecification): Stem {
  let bottomPair = new PairWrapper(spec.bottomPair);
  let size = 'size' in spec ? spec.size : spec.numPairs;

  return {
    position5: bottomPair.upstreamPartner,
    position3: bottomPair.downstreamPartner,
    size,
  };
}

/**
 * Returns the pairs in the stem.
 */
export function pairsInStem(st: Stem): Pair[] {
  let prs: Pair[] = [];
  for (let i = 0; i < st.size; i++) {
    prs.push([st.position5 + i, st.position3 - i]);
  }
  return prs;
}

/**
 * Returns the number of pairs in the stem.
 */
export function numPairs(stem: Stem): number {
  return stem.size;
}

export function bottomPair(st: Stem): Pair {
  return [st.position5, st.position3];
}

export function topPair(st: Stem): Pair {
  return [
    st.position5 + st.size - 1,
    st.position3 - st.size + 1,
  ];
}
