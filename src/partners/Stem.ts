import { Pair } from 'Partners/pairs/Pair';
import { PairWrapper } from 'Partners/PairWrapper';

// a consecutive stack of pairs
export type Stem = {
  // the 5' most position of the stem
  position5: number;
  // the 3' most position of the stem
  position3: number;
  // the number of pairs in the stem
  size: number;
};

export type StemSpecification = { bottomPair: Pair, size: number };

// allows for stem objects to be specified in different ways
// without knowledge of the underlying object structure
export function createStem(spec: StemSpecification): Stem {
  let bottomPair = new PairWrapper(spec.bottomPair);
  return {
    position5: bottomPair.upstreamPartner,
    position3: bottomPair.downstreamPartner,
    size: spec.size,
  };
}

// returns the pairs in the stem
export function pairs(st: Stem): Pair[] {
  let prs: Pair[] = [];
  for (let i = 0; i < st.size; i++) {
    prs.push([st.position5 + i, st.position3 - i]);
  }
  return prs;
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

export function contains(st: Stem, p: number): boolean {
  let bpr = new PairWrapper(bottomPair(st));
  let tpr = new PairWrapper(topPair(st));
  return (
    (p >= bpr.upstreamPartner && p <= tpr.upstreamPartner)
    || (p <= bpr.downstreamPartner && p >= tpr.downstreamPartner)
  );
}
