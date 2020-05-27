function _parseBoundingPosition5(p: number, partners: (number | null)[]): number {
  while (p > 0 && !partners[p - 1]) {
    p--;
  }
  return p;
}

function _parseBoundingPosition3(p: number, partners: (number | null)[]): number {
  while (p <= partners.length && !partners[p - 1]) {
    p++;
  }
  return p;
}

export interface UnpairedRegion {

  // the 5' bounding position
  boundingPosition5: number;

  // the 3' bounding position
  boundingPosition3: number;
}

/**
 * Returns null if the position is not in an unpaired region.
 */
export function unpairedRegionOfPosition(p: number, partners: (number | null)[]): (UnpairedRegion | null) {
  if (partners[p - 1]) {
    return null;
  }
  return {
    boundingPosition5: _parseBoundingPosition5(p, partners),
    boundingPosition3: _parseBoundingPosition3(p, partners),
  };
}

export default unpairedRegionOfPosition;
