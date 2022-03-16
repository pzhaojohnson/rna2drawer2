const basicComplements: { [c: string]: string[] | undefined } = {
  'A': ['U', 'T'],
  'C': ['G'],
  'G': ['C'],
  'U': ['A'],
  'T': ['A'],
};

// complements involving G, U and T
const complementsGUT: { [c: string]: string[] | undefined } = {
  'G': ['U', 'T'],
  'U': ['G'],
  'T': ['G'],
};

// complements involving special IUPAC single letter codes
// (i.e., codes that are not A, C, G, U or T)
const specialIUPACComplements: { [c: string]: string[] | undefined } = {
  'R': ['Y', 'C', 'U', 'T'],
  'Y': ['R', 'A', 'G'],
  'W': ['W', 'A', 'U', 'T'],
  'S': ['S', 'G', 'C'],
  'K': ['K', 'G', 'U', 'T'],
  'A': ['Y', 'W'],
  'C': ['R', 'S'],
  'G': ['Y', 'S', 'K'],
  'U': ['R', 'W', 'K'],
  'T': ['R', 'W', 'K'],
};

export type Options = {

  // whether to complement Gs with Us and Ts
  GUT?: boolean;

  // whether to allow complements based on IUPAC single letter codes
  IUPAC?: boolean;
};

/**
 * This function is not case-sensitive.
 */
export function charactersAreComplementary(c1: string, c2: string, options?: Options): boolean {
  c1 = c1.toUpperCase();
  c2 = c2.toUpperCase();

  if (basicComplements[c1]?.includes(c2)) {
    return true;
  }

  if (options?.GUT && complementsGUT[c1]?.includes(c2)) {
    return true;
  }

  if (options?.IUPAC) {
    if (c1 == 'N' || c2 == 'N') {
      return true;
    }

    if (specialIUPACComplements[c1]?.includes(c2)) {
      // complements involving K would form GU or GT pairs
      if (options?.GUT || ![c1, c2].includes('K')) {
        return true;
      }
    }
  }

  return false;
}
