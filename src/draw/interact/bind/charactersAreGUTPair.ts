// all possible GUT complements (including those involving
// the special IUPAC single letter code K)
const complementsGUT: { [c: string]: string[] | undefined } = {
  'G': ['U', 'T', 'K'],
  'U': ['G', 'K'],
  'T': ['G', 'K'],
  'K': ['K', 'G', 'U', 'T'],
};

export type Options = {

  // whether to recognize pairs involving the special IUPAC
  // single letter code K
  IUPAC?: boolean;
};

/**
 * Returns true if the two characters form a GU or GT pair.
 *
 * This function is not case-sensitive.
 */
export function charactersAreGUTPair(c1: string, c2: string, options?: Options): boolean {
  let IUPAC = options?.IUPAC;

  c1 = c1.toUpperCase();
  c2 = c2.toUpperCase();

  let areGUTPair = complementsGUT[c1]?.includes(c2) ?? false;

  // true if either character is K
  let k = c1 == 'K' || c2 == 'K';

  return (
    areGUTPair
    && (IUPAC || !k)
  );
}
