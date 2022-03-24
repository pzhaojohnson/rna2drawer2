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

  // whether to recognize pairs involving the single letter code K
  // (which form GU and GT pairs)
  GUT?: boolean;
};

/**
 * Returns true if the characters form a pair involving special IUPAC
 * single letter codes.
 *
 * This function is not case-sensitive.
 */
export function charactersAreSpecialIUPACPair(c1: string, c2: string, options?: Options): boolean {
  let GUT = options?.GUT;

  c1 = c1.toUpperCase();
  c2 = c2.toUpperCase();

  // N can pair with anything
  if (c1 == 'N' || c2 == 'N') {
    return true;
  }

  let areSpecialIUPACPair = specialIUPACComplements[c1]?.includes(c2) ?? false;

  // true if the pair involves K
  let k = c1 == 'K' || c2 == 'K';

  return (
    areSpecialIUPACPair
    && (GUT || !k)
  );
}
