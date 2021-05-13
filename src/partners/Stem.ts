import {
  Pair,
  partner5,
  partner3,
} from './Pair';

// a consecutive stack of pairs
export type Stem = {
  // the 5' most position of the stem
  position5: number;
  // the 3' most position of the stem
  position3: number;
  // the number of pairs in the stem
  size: number;
};

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
  let bpr = bottomPair(st);
  let tpr = topPair(st);
  return (
    (p >= partner5(bpr) && p <= partner5(tpr))
    || (p <= partner3(bpr) && p >= partner3(tpr))
  );
}
