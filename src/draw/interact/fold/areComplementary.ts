import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';

const _COMPLEMENTS: { [key: string]: string[] } = {
  'A': ['U', 'T'],
  'U': ['A', 'G'],
  'G': ['C', 'U', 'T'],
  'C': ['G'],
  'T': ['A', 'G'],
};

function _areGUT(c1: string, c2: string): boolean {
  c1 = c1.toUpperCase();
  c2 = c2.toUpperCase();
  if (c1 == 'G') {
    return c2 == 'U' || c2 == 'T';
  } else if (c2 == 'G') {
    return c1 == 'U' || c1 == 'T';
  } else {
    return false;
  }
}

/**
 * For individual characters.
 */
function _areComplementary(mode: FoldingMode, c1: string, c2: string): boolean {
  c1 = c1.toUpperCase();
  c2 = c2.toUpperCase();
  if (!mode.includeGUT && _areGUT(c1, c2)) {
    return false;
  }
  let comps1 = _COMPLEMENTS[c1];
  if (comps1) {
    return comps1.includes(c2);
  } else {
    return false;
  }
}

export function areComplementary(mode: FoldingMode, chars1: string, chars2: string): boolean {
  if (chars1.length !== chars2.length) {
    return false;
  }
  if (chars1.length == 0) {
    return false;
  }
  let numMismatches = 0;
  for (let i = 0; i < chars1.length; i++) {
    let c1 = chars1.charAt(i);
    let c2 = chars2.charAt(chars2.length - i - 1);
    if (!_areComplementary(mode, c1, c2)) {
      numMismatches++;
    }
  }
  return (numMismatches / chars1.length) <= mode.allowedMismatch;
}

export default areComplementary;
