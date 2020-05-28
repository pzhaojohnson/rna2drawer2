const COMPLEMENTS: { [key: string]: string[] } = {
  'A': ['U', 'T'],
  'U': ['A', 'G'],
  'G': ['C', 'U', 'T'],
  'C': ['G'],
  'T': ['A', 'G'],
};

export function areComplementary(characters1: string, characters2: string): boolean {
  if (characters1.length !== characters2.length) {
    return false;
  }
  for (let i = 0; i < characters1.length; i++) {
    let c1 = characters1.charAt(i);
    let c2 = characters2.charAt(characters2.length - i - 1);
    if (!COMPLEMENTS[c1].includes(c2)) {
      return false;
    }
  }
  return true;
}

export default areComplementary;
