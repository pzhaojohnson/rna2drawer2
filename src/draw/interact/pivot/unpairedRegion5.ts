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
export function unpairedRegion5(st: Stem, partners: (number | null)[]): (UnpairedRegion | null) {
  if (!st || !partners) {
    return null;
  }
  let p = st.position5 - 1;
  if (p > 0 && !partners[p - 1]) {
    return unpairedRegionOfPosition(p, partners);
  }
  return {
    boundingPosition5: p,
    boundingPosition3: st.position5,
  };
}

export default unpairedRegion5;

export {
  UnpairedRegion,
};
