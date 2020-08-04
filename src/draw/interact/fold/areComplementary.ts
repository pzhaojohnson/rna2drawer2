const _COMPLEMENTS: { [key: string]: string[] } = {
  'A': ['U', 'T'],
  'U': ['A', 'G'],
  'G': ['C', 'U', 'T'],
  'C': ['G'],
  'T': ['A', 'G'],
};

export function areComplementary(chars1: string, chars2: string): boolean {
  if (chars1.length !== chars2.length) {
    return false;
  }
  if (chars1.length == 0 && chars2.length == 0) {
    return false;
  }
  chars1 = chars1.toUpperCase();
  chars2 = chars2.toUpperCase();
  for (let i = 0; i < chars1.length; i++) {
    let c1 = chars1.charAt(i);
    let c2 = chars2.charAt(chars2.length - i - 1);
    let comps1 = _COMPLEMENTS[c1];
    if (!comps1 || !comps1.includes(c2)) {
      return false;
    }
  }
  return true;
}

export default areComplementary;
