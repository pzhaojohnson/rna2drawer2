function _parsePosition5(p: number, partners: (number | null)[]): number {
  let q = partners[p - 1];
  let p5 = Math.min(p, q);
  let p3 = Math.max(p, q);
  while (p5 > 1 && partners[p5 - 2] === p3 + 1) {
    p5--;
    p3++;
  }
  return p5;
}

function _parsePositionTop5(p: number, partners: (number | null)[]): number {
  let q = partners[p - 1];
  let p5 = Math.min(p, q);
  let p3 = Math.max(p, q);
  while (p5 < p3 - 2 && partners[p5] === p3 - 1) {
    p5++;
    p3--;
  }
  return p5;
}

export interface Stem {

  // the 5' most position of the stem
  position5: number;

  // the 3' most position of the stem
  position3: number;

  // the number of base pairs in the stem
  size: number;
}

/**
 * Returns null if the position is not in a stem.
 */
export function stemOfPosition(p: number, partners: (number | null)[]): (Stem | null) {
  if (!partners[p - 1]) {
    return null;
  }
  let p5 = _parsePosition5(p, partners);
  let pt5 = _parsePositionTop5(p, partners);
  return {
    position5: p5,
    position3: partners[p5 - 1],
    size: pt5 - p5 + 1,
  };
}

export default stemOfPosition;
