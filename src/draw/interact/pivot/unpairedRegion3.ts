import {
  unpairedRegionOfPosition,
  UnpairedRegion,
} from '../../../parse/unpairedRegionOfPosition';

export interface Stem {
  position5: number;
  position3: number;
}

/**
 * It is undefined what this function returns if the given stem
 * does not exist in the given partners notation.
 */
export function unpairedRegion3(st: Stem, partners: (number | null)[]): (UnpairedRegion | null) {
  if (!st || !partners) {
    return null;
  }
  let p = st.position3 + 1;
  if (p <= partners.length && !partners[p - 1]) {
    return unpairedRegionOfPosition(p, partners);
  }
  return {
    boundingPosition5: st.position3,
    boundingPosition3: p,
  };
}

export default unpairedRegion3;

export {
  UnpairedRegion,
};
