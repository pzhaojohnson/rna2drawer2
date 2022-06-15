// matches for special IUPAC single letter codes
// (i.e., codes that are not A, C, G, U or T)
const specialIUPACMatches: { [c: string]: string[] | undefined } = {
  'R': ['A', 'G'],
  'Y': ['C', 'U', 'T'],
  'W': ['A', 'U', 'T'],
  'S': ['G', 'C'],
  'K': ['G', 'U', 'T'],
  'M': ['A', 'C'],
  'B': ['C', 'G', 'U', 'T'],
  'D': ['A', 'G', 'U', 'T'],
  'H': ['A', 'C', 'U', 'T'],
  'V': ['A', 'C', 'G'],
  'A': ['R', 'W', 'M', 'D', 'H', 'V'],
  'C': ['Y', 'S', 'M', 'B', 'H', 'V'],
  'G': ['R', 'S', 'K', 'B', 'D', 'V'],
  'U': ['Y', 'W', 'K', 'B', 'D', 'H'],
  'T': ['Y', 'W', 'K', 'B', 'D', 'H'],
};

export type Options = {

  // whether to match Us with Ts
  UT?: boolean;

  // whether to use IUPAC single letter codes
  // (e.g., R for purines, N for any base)
  IUPAC?: boolean;
};

/**
 * Matching is not case-sensitive.
 */
export function charactersMatch(c1: string, c2: string, options?: Options): boolean {
  c1 = c1.toUpperCase();
  c2 = c2.toUpperCase();

  if (c1 == c2) {
    return true;
  }

  if (options?.UT) {
    let cs = c1 + c2;
    if (cs == 'UT' || cs == 'TU') {
      return true;
    }
  }

  if (options?.IUPAC) {
    if (specialIUPACMatches[c1]?.includes(c2)) {
      return true;
    } else if (c1 == 'N' || c2 == 'N') {
      return true;
    }
  }

  return false;
}
