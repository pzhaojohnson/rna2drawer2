interface TertiaryBond {
  id: string;
  hasBeenRemoved: () => boolean;
}

function areSameTertiaryBond(tb1: TertiaryBond, tb2: TertiaryBond): boolean {
  if (!tb1 || !tb2) {
    return false;
  }
  if (tb1.hasBeenRemoved() || tb2.hasBeenRemoved()) {
    return false;
  }
  return tb1.id === tb2.id;
}

export default areSameTertiaryBond;
