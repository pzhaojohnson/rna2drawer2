import { charactersAreGUTPair } from './charactersAreGUTPair';
import { charactersAreSpecialIUPACPair } from './charactersAreSpecialIUPACPair';

const basicComplements: { [c: string]: string[] | undefined } = {
  'A': ['U', 'T'],
  'C': ['G'],
  'G': ['C'],
  'U': ['A'],
  'T': ['A'],
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
  let GUT = options?.GUT;
  let IUPAC = options?.IUPAC;

  c1 = c1.toUpperCase();
  c2 = c2.toUpperCase();

  if (basicComplements[c1]?.includes(c2)) {
    return true;
  }

  if (GUT && charactersAreGUTPair(c1, c2, { IUPAC })) {
    return true;
  }

  if (IUPAC && charactersAreSpecialIUPACPair(c1, c2, { GUT })) {
    return true;
  }

  return false;
}
